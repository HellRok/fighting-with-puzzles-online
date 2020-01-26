import m from 'mithril';
import { filter, sample, some, uniq } from 'lodash/collection';
import { min, max } from 'lodash/math';
import { range } from 'lodash/util';

import Cluster from '../lib/cluster';
import Gem from '../lib/gem';
import Settings from '../lib/settings';
import { displayMilliseconds } from '../lib/helpers';

export default class Board {
  constructor() {
    this.id = 1;
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
      gemsSmashed: 0,
      lastGemsSmashed: 0,
      clustersSmashed: 0,
      lastClusterGemsSmashed: 0,
      lastChain: 0,
      highestChain: 0,
      runningTime: 0,
    }
    m.redraw();
  }

  context() {
    if (!this.context2d) {
      this.context2d = document.querySelector(`#board-${this.id}`).getContext('2d');
    }

    return this.context2d;
  }

  update() {
    // Clear the stats of the last update
    this.stats.lastChain = 0;
    this.stats.lastGemsSmashed = 0;
    this.stats.lastClusterGemsSmashed = 0;

    this.stats.lastChain = this.growAndCreateClustersAndSmashGems();
    if (this.stats.lastChain > this.stats.highestChain) {
      this.stats.highestChain = this.stats.lastChain;
    }
    this.stats.lastGemsSmashed -= this.stats.lastClusterGemsSmashed;

    m.redraw();
  }

  blank() {
    this.context().clearRect(0, 0, 32 * this.width, 32 * this.height);
  }

  render() {
    const _this = this;
    this.blank();

    this.activePiece.forEach((gem, _) => {
      gem.render(_this.context());
    });

    this.forEachSquare((x, y) => {
      const square = _this.getSquare(x, y);
      if (square) { square.render(_this.context()); }
    });

    this.timeValue.innerText = displayMilliseconds(this.stats.runningTime);

    if (Settings.debug) {
      this.context().fillText(`Game:   ${this.debug.gameTick}ms`,   2, 10);
      this.context().fillText(`Render: ${this.debug.renderTick}ms`, 2, 20);
    }
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

      if (gem === undefined || gem.cluster !== undefined) { return undefined; }

      if (
        gem.rightGem()      && !gem.rightGem().cluster      && gem.rightGem().colour      === gem.colour &&
        gem.belowGem()      && !gem.belowGem().cluster      && gem.belowGem().colour      === gem.colour &&
        gem.belowRightGem() && !gem.belowRightGem().cluster && gem.belowRightGem().colour === gem.colour
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

  growAndCreateClustersAndSmashGems(currentChain = 0) {
    if (currentChain > 100) { throw "lol, nope"; }

    this.growClusters();
    this.createClusters();

    let atLeastOneSmash = false;

    const smashers = filter(this.data, gem => (gem && gem.smasher));
    smashers.forEach(gem => gem.attemptSmash());

    this.data.forEach(gem => {
      if (gem && gem.toSmash) {
        atLeastOneSmash = true;
        this.setSquare(undefined, gem.x, gem.y);
      }
    });

    this.data.forEach(gem => { gem && gem.gravity() });

    if (atLeastOneSmash) {
      currentChain = this.growAndCreateClustersAndSmashGems(currentChain + 1)
    }

    return currentChain;
  }

  view() {
    const _this = this;
    return [
      m('.board-container', [
        m('.overlay',
          {
            class: (this.overlay ? '' : 'hide'),
            style: {
              width: `${32 * this.width}px`,
            }
          }, this.overlay),
        m('canvas.board', {
          id: `board-${this.id}`,
          width: (32 * this.width),
          height: (32 * this.height)
        }),
        this.pieceQueue.map((i,_) => m('.piece', i.map((j,_) => j.colour))),
        m('.stats', [
          m('.time', 'Time: ', m('span.value', displayMilliseconds(this.stats.runningTime))),
          m('.gems-smashed', `Gems smashed: ${this.stats.gemsSmashed}`),
          m('.clusters-smashed', `Clusters smashed: ${this.stats.clustersSmashed}`),
          m('.last-gems-smashed', `Last gems smashed: ${this.stats.lastGemsSmashed}`),
          m('.last-cluster-gems-smashed', `Last cluster gems smashed: ${this.stats.lastClusterGemsSmashed}`),
          m('.last-chain', `Last chain: ${this.stats.lastChain}`),
          m('.highest-chain', `Highest chain: ${this.stats.highestChain}`),
        ])
      ]),
    ];
  }
};
