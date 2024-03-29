import m from 'mithril';
import { filter, sample, some, uniq } from 'lodash/collection';
import { floor, min, max, sum } from 'lodash/math';
import { range } from 'lodash/util';

import MobileControls from './_mobile_controls';
import Cluster from '../lib/cluster';
import Gem from '../lib/gem';
import Settings from '../lib/settings';
import { displayMilliseconds } from '../lib/helpers';

export default class Board {
  constructor(id=1) {
    this.id = id;
    this.width = 6;
    this.height = 12;
    this.theme = document.querySelector('#gems');
    this.context2d;
    this.clear();

    this.debug = {
      show: false,
      gameTick: 0,
      renderTick: 0,
    }
  }

  clear() {
    this.activePiece = [];
    this.pieceQueue = [];
    this.data = [];
    this.clusters = [];
    this.overlay = undefined;
    this.stats = {
      score: 0,
      damage: 0,
      gemsSmashed: 0,
      lastGemsSmashed: 0,
      clustersSmashed: 0,
      lastClusterGemsSmashed: 0,
      lastChain: 0,
      lastScore: 0,
      lastDamage: 0,
      highestChain: 0,
      runningTime: 0,
      gpm: 0.00,
    }

    m.redraw();
  }

  context() {
    if (!this.context2d) {
      this.context2d = this.boardElement().getContext('2d');
      this.context2d.font = 'normal normal 10px monospace';
    }

    this.context2d.fillStyle = Settings.site.lightMode ? 'black' : 'white';

    return this.context2d;
  }

  update() {
    // Clear the stats of the last update
    this.stats.lastChain = 0;
    this.stats.lastGemsSmashed = 0;
    this.stats.lastClusterGemsSmashed = 0;
    this.stats.lastScore = 0;
    this.stats.lastDamage = 0;

    this.countDownTimerGems();

    this.growAndCreateClustersAndSmashGems();

    if (this.stats.lastChain > this.stats.highestChain) {
      this.stats.highestChain = this.stats.lastChain;
    }

    this.stats.lastGemsSmashed -= this.stats.lastClusterGemsSmashed;
    this.stats.score += this.stats.lastScore;
    this.stats.damage += this.stats.lastDamage;

    m.redraw();
  }

  boardElement() {
    return document.querySelector(`#board-${this.id}`);
  }

  blank() {
    this.context().clearRect(0, 0, 32 * this.width, 32 * this.height);
  }

  render() {
    // Turns out this can be called before the element itself has been drawn by
    // mithril, so we defer a frame in that case.
    if (!this.boardElement()) { return };

    const _this = this;
    this.blank();

    this.activePiece.forEach((gem, _) => {
      gem.render(_this.context(), this.offset());
    });

    this.forEachSquare((x, y) => {
      const square = _this.getSquare(x, y);
      if (square) { square.render(_this.context(), this.offset()); }
    });

    this.renderLines();

    if (Settings.debug && this.id === 1) {
      this.context().fillText(`Game:     ${this.debug.gameTick}ms`,                    2,  10);
      this.context().fillText(`Render:   ${this.debug.renderTick}ms`,                  2,  20);
      this.context().fillText(`Score:    ${this.stats.score}`,                         2,  30);
      this.context().fillText(`Damage:   ${this.stats.damage}`,                        2,  40);
      this.context().fillText(`Gems:     ${filter(this.data, gem => gem).length}`,     2,  50);
      this.context().fillText(`Clusters: ${this.clusters.length}`,                     2,  60);
      this.context().fillText(`State:    ${this.game.state.alive ? 'Alive' : 'Dead'}`, 2,  70);
      this.context().fillText(`LGems:    ${this.stats.lastGemsSmashed}`,               2,  80);
      this.context().fillText(`LCGems:   ${this.stats.lastClusterGemsSmashed}`,        2,  90);
      this.context().fillText(`LChain:   ${this.stats.lastChain}`,                     2, 100);
      this.context().fillText(`LScore:   ${this.stats.lastScore}`,                     2, 110);
      this.context().fillText(`LDamage:  ${this.stats.lastDamage}`,                    2, 120);
    }

    m.redraw();
  }

  renderLines() {
    if (!this.game) { return; }

    range(0, this.game.battleState.lines).map(line => {
      range(0, this.width).map(x => {
        this.context().drawImage(
          this.theme,
          0, 128,
          32, 32,
          x * 32, (this.height - line - 1) * 32,
          32, 32,
        )
      });
    });
  }

  offset() {
    return { x: 0, y: this.game.battleState.lines };
  }

  /* This will get passed an array of objects that respond to .x and .y */
  isClear(positions) {
    const minX = min(positions.map(piece => piece.x));
    const maxX = max(positions.map(piece => piece.x));
    const minY = min(positions.map(piece => piece.y));
    const maxY = max(positions.map(piece => piece.y));

    if (minX < 0) { return false; }
    if (minY < 0) { return false; }
    if (maxX >= this.width) { return false; }
    if (maxY >= this.height) { return false; }

    return !some(positions, (position, a, b) => {
      if (this.getSquare(position.x, position.y)) { return true; }
    });
  }

  forEachSquare(func) {
    return range(0, this.height).map(y => {
      return range(this.width).map(x => {
        return func(x, y);
      });
    }).flat();
  }

  forEachGem(func) {
    const _this = this;
    return this.forEachSquare((x, y) => func(_this.getSquare(x, y)));
  }

  getSquare(x, y) {
    return this.data[
      x + (y * this.width)
    ];
  }

  setSquare(gem, x, y) {
    if (typeof gem !== 'undefined') {
      x = gem.x;
      y = gem.y;
    }

    this.data[x + (y * this.width)] = gem;
  }

  setGems(gemOne, gemTwo) {
    this.setSquare(gemOne);
    this.setSquare(gemTwo);
  }

  growClusters() {
    this.clusters.forEach(cluster => {
      cluster.attemptGrowth();
    });
  }

  createClusters() {
    this.forEachSquare((x, y) => {
      const gem = this.getSquare(x, y);

      if (gem === undefined || gem.cluster !== undefined || gem.timer) { return undefined; }

      if (
        gem.clusterableWith(gem.rightGem()) &&
        gem.clusterableWith(gem.belowGem()) &&
        gem.clusterableWith(gem.belowRightGem())
      ) {
        const cluster = new Cluster([
          gem,
          gem.rightGem(),
          gem.belowGem(),
          gem.belowRightGem(),
        ]);

        this.clusters.push(cluster);

        gem.cluster = cluster;
        gem.rightGem().cluster = cluster;
        gem.belowGem().cluster = cluster;
        gem.belowRightGem().cluster = cluster;

        cluster.attemptGrowth();
      }
    });
  }

  growAndCreateClustersAndSmashGems() {
    this.growClusters();
    this.createClusters();


    const smashers = filter(this.data, gem => (gem && gem.smasher));
    let damage = sum(smashers.map(gem => gem.attemptSmash()));

    this.data.forEach(gem => {
      if (gem && gem.toSmash) {
        this.setSquare(undefined, gem.x, gem.y);
      }
    });

    this.data.forEach(gem => { gem && gem.gravity() });

    if (damage > 0) {
      // Chain damage
      this.stats.lastChain += 1;
      if (this.stats.lastChain === 2) {
        damage += 2;
      } else if (this.stats.lastChain === 3) {
        damage += 4;
      } else if (this.stats.lastChain > 3) {
        damage += 4 + (6 * (this.stats.lastChain - 3));
      }

      this.game.sendGarbage(damage);

      this.growAndCreateClustersAndSmashGems();
    }

    this.stats.lastDamage += damage;
  }

  countDownTimerGems() {
    this.data.forEach(gem => {
      if (!gem) { return; }
      if (gem.timer > 0) { gem.timer -= 1; }
    });
  }

  damage() {
    return this.game.garbageQueue.length;
  }

  damageCounter() {
    let hundreds = -1;
    let tens = -1;
    let singles = 0;

    if (this.game) {
      const damage = this.damage();
      const damageStr = damage.toString();

      // I don't think over 1000 is actually possible, but lets not take any chances
      if (damage > 999) {
        hundreds = 9;
        tens = 9;
        singles = 9;
      } else if (damage > 99) {
        hundreds = damageStr[0];
        tens = damageStr[1];
        singles = damageStr[2];
      } else if (damage > 9) {
        tens = damageStr[0];
        singles = damageStr[1];
      } else {
        singles = damageStr;
      }
    }

    return [hundreds, tens, singles].map(i =>{
      if (i === -1) {
        return m('.gem.damage-blank');
      } else {
        return m(`.gem.damage-${i}`);
      }
    });
  }

  displayDropPattern(dropPattern) {
    dropPattern.forEach((gem, index) => {
      const x = index % 6;
      const y = floor(index / 6);
      this.setSquare(new Gem(this, x, y, gem, false));
    });
  }

  toString() {
    return this.forEachGem(gem => gem ? gem.toString() : '  ').join('');
  }

  view() {
    const _this = this;
    return [
      m(MobileControls),
      m('.board-container', [
        m('.board-wrapper', {
        }, [
          m('canvas.board', {
            id: `board-${this.id}`,
            width: (32 * this.width),
            height: (32 * this.height)
          }),
          m('.lockdelay-progress'),
        ]),
        m('.game-info', [
          m('.piece-queue',
            this.pieceQueue.map((i,_) => m('.piece', i.map((j,_) => m('.gem', {
              class: `${j.colour} ${ j.smasher ? 'smasher' : ''} ${ j.timer ? `timer-${j.timer}` : ''}`
            }))))
          ),
          m('.incoming-damage', this.damageCounter()),
        ]),
        m('.overlay',
          {
            class: (this.overlay ? '' : 'hide'),
          }, this.overlay),
      ]),
    ];
  }
};
