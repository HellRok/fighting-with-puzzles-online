import { filter } from 'lodash/collection';
import { sum } from 'lodash/math';
import { offsetPositions } from './helpers';

export default class Gem {
  constructor(board, x, y, colour, smasher, timer=0) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.smasher = smasher;
    this.timer = timer;
    this.toSmash = false;
    this.cluster;
  }

  render(context, offset) {
    context.drawImage(
      this.board.theme,
      ...this.sprite(),
      (this.x + offset.x) * 32, (this.board.height - (this.y + offset.y) - 1) * 32,
      32, 32,
    )
  }

  sprite() {
    let colourOffset = 0;
    let variantOffset = 0;

    if (this.colour === 'red') {
      colourOffset = 0;
    } else if (this.colour === 'blue') {
      colourOffset = 1;
    } else if (this.colour === 'orange') {
      colourOffset = 2;
    } else if (this.colour === 'purple') {
      colourOffset = 3;
    }

    if (this.cluster) {
      variantOffset = 9;

      if (this.differentOrUndefined(this.aboveGem())) {
        if (this.differentOrUndefined(this.leftGem())) {
          variantOffset = 1;
        } else if (this.differentOrUndefined(this.rightGem())) {
          variantOffset = 3;
        } else {
          variantOffset = 2;
        }
      }

      if (this.differentOrUndefined(this.rightGem())) {
        if (this.differentOrUndefined(this.aboveGem())) {
          variantOffset = 3;
        } else if (this.differentOrUndefined(this.belowGem())) {
          variantOffset = 6;
        } else {
          variantOffset = 4;
        }
      }

      if (this.differentOrUndefined(this.belowGem())) {
        if (this.differentOrUndefined(this.leftGem())) {
          variantOffset = 6;
        } else if (this.differentOrUndefined(this.rightGem())) {
          variantOffset = 8;
        } else {
          variantOffset = 7;
        }
      }

      if (this.differentOrUndefined(this.leftGem())) {
        if (this.differentOrUndefined(this.aboveGem())) {
          variantOffset = 1;
        } else if (this.differentOrUndefined(this.belowGem())) {
          variantOffset = 6;
        } else {
          variantOffset = 5;
        }
      }
    }

    if (this.smasher) {
      variantOffset = 10
    }

    if (this.timer) {
      variantOffset = 11 + (5 - this.timer);
    }

    if (this.colour === 'all-smasher') {
      colourOffset = 4;
      variantOffset = 1;
    }

    return [
      variantOffset * 32, colourOffset * 32,
      32, 32
    ];
  }

  attemptSmash() {
    if (this.colour === 'all-smasher') { return this.allSmash(); }

    // If we are a smasher, we must have at least one other gem of the same
    // colour that isn't a timer or we don't smash.
    if (
      this.smasher && (
        (this.leftGem()  && !this.leftGem().timer  && this.leftGem().colour  === this.colour) ||
        (this.rightGem() && !this.rightGem().timer && this.rightGem().colour === this.colour) ||
        (this.belowGem() && !this.belowGem().timer && this.belowGem().colour === this.colour) ||
        (this.aboveGem() && !this.aboveGem().timer && this.aboveGem().colour === this.colour)
      )
    ) {
      return this.smash();
    } else {
      return 0;
    }
  }

  canSmash(gem) {
    // This needs a little explaining, basically there are 4 different concerns here:
    // 1. Are we actually trying to smash a gem?
    // 2. Am _I_ a timer gem? (Timer gems can be smashed but don't cascade the effect)
    // 3. Is the other gem already flagged to be smashed?
    // 4. Is the other gem the same colour as us?
    // 5. Are they a timer gem? If so we can smash disregarding colour
    return (
      gem &&                         // #1
      !this.timer &&                 // #2
      !gem.toSmash &&                // #3
      (
        gem.colour === this.colour  || // #4
        gem.timer                      // #5
      )
    );
  }

  allSmash() {
    this.toSmash = true;

    const belowGem = this.belowGem();

    if (!belowGem) {
      this.board.stats.lastScore += 5000;
      return;
    }

    let damage = 1

    damage += sum(this.board.forEachGem((gem) => {
      if (gem && gem.colour === belowGem.colour) {
        return gem.smash();
      } else {
        return 0;
      }
    }));

    return Math.floor(damage * 0.7);
  }

  smash() {
    if (this.toSmash) { return 0; }

    let damage = 1;

    this.toSmash = true;
    this.board.stats.lastScore += this.score();

    if (this.cluster) {
      const _this = this;
      this.board.stats.lastClusterGemsSmashed += this.cluster.gems.length;
      this.board.stats.clustersSmashed += 1;

      // This is cluster damage - gems because each of the other gems are going
      // to count as 1 damage, and rejigging that logic seems fiddly and not
      // worth it, so we just remove it here knowing it'll come back later
      damage += this.cluster.damage() - this.cluster.gems.length;

      this.board.clusters = filter(this.board.clusters, cluster => cluster !== _this.cluster)
      this.cluster.gems.forEach(gem => gem.cluster = undefined);
    }

    if (this.canSmash(this.leftGem())) {
      damage += this.leftGem().smash();
    }
    if (this.canSmash(this.rightGem())) {
      damage += this.rightGem().smash();
    }
    if (this.canSmash(this.belowGem())) {
      damage += this.belowGem().smash();
    }
    if (this.canSmash(this.aboveGem())) {
      damage += this.aboveGem().smash();
    }

    this.board.stats.gemsSmashed += 1;
    this.board.stats.lastGemsSmashed += 1;

    return damage;
  }

  score() {
    // A gem alone is worth 100, the cluster scoring logic is documented in the
    // Cluster#score method, and the multiplier is simple 1 + currentChain * 0.5
    let value = 100;
    if (this.cluster) {
      value += this.cluster.score();
    }

    return (
      value * (1 + this.board.stats.lastChain * 0.5)
    );
  }

  gravity() {
    if (this.cluster) {
      this.cluster.gravity()
    } else {
      this.board.setSquare(undefined, this.x, this.y);

      while (this.board.isClear(offsetPositions([this], [0, -1]))) {
        this.y = this.y - 1;
      }

      this.board.setSquare(this);
    }
  }

  toString() {
    let colour = this.colour[0];
    if (this.smasher) { colour = colour.toUpperCase(); }

    return `${colour}${this.timer}`
  }

  differentOrUndefined(gem) {
    return (
      gem === undefined ||
      gem && gem.cluster !== this.cluster
    );
  }

  clusterableWith(gem) {
    return (!!gem && !gem.cluster && !gem.timer && gem.colour === this.colour);
  }

  leftGem() {
    if (this.x === 0) { return undefined; }
    return this.board.getSquare(this.x - 1, this.y);
  }

  rightGem() {
    if (this.x === (this.board.width - 1)) { return undefined; }
    return this.board.getSquare(this.x + 1, this.y);
  }

  belowGem() {
    if (this.y === 0) { return undefined; }
    return this.board.getSquare(this.x, this.y - 1);
  }

  aboveGem() {
    if (this.y === (this.board.height - 1)) { return undefined; }
    return this.board.getSquare(this.x, this.y + 1);
  }

  belowRightGem() {
    if (
      this.y === 0 ||
      this.x === (this.board.width - 1)
    ) { return undefined; }

    return this.board.getSquare(this.x + 1, this.y - 1);
  }
};
