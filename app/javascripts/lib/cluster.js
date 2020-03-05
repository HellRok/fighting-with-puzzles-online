import { range } from 'lodash/util';
import { min, max } from 'lodash/math';
import { every } from 'lodash/collection';
import { offsetPositions } from './helpers';

export default class Cluster {
  constructor(gems) {
    this.board = gems[0].board;
    this.colour = gems[0].colour;
    this.gems = gems;
  }

  left() {
    return min(this.gems.map(gem => gem.x));
  }

  right() {
    return max(this.gems.map(gem => gem.x));
  }

  bottom() {
    return min(this.gems.map(gem => gem.y));
  }

  top() {
    return max(this.gems.map(gem => gem.y));
  }

  width() {
    return this.right() - this.left();
  }

  height() {
    return this.top() - this.bottom();
  }

  leftGems() {
    if (this.left() === 0) { return [] };

    return range(this.bottom(), this.top() + 1).map(y => {
      return this.board.getSquare(this.left() - 1, y);
    });
  }

  rightGems() {
    if (this.right() === (this.board.width - 1)) { return [] };

    return range(this.bottom(), this.top() + 1).map(y => {
      return this.board.getSquare(this.right() + 1, y);
    });
  }

  belowGems() {
    if (this.bottom() === 0) { return [] };

    return range(this.left(), this.right() + 1).map(x => {
      return this.board.getSquare(x, this.bottom() - 1);
    });
  }

  aboveGems() {
    if (this.top() === (this.board.height - 1)) { return [] };

    return range(this.left(), this.right() + 1).map(x => {
      return this.board.getSquare(x, this.top() + 1);
    });
  }

  addGems(gems) {
    gems.forEach(gem => {
      gem.cluster = this;
      this.gems.push(gem);
    });
  }

  attemptGrowth() {
    let didGrow = false;

    // Growth order is up > right > left > down
    [this.aboveGems(), this.rightGems(), this.leftGems(), this.belowGems()].forEach(gems => {
      if (gems.length > 0 && every(gems, gem => {
        return (gem && !gem.cluster && !gem.timer && gem.colour === this.colour);
      })) {
        this.addGems(gems);
        this.attemptGrowth()
      }
    });

    return false;
  }

  gravity() {
    this.gems.forEach(gem => this.board.setSquare(undefined, gem.x, gem.y));

    while (this.board.isClear(offsetPositions(this.gems, [0, -1]))) {
      this.gems.forEach(gem => gem.y = gem.y - 1);
    }

    this.gems.forEach(gem => this.board.setSquare(gem));
  }

  score() {
    // So basically we add an extra 100 for each gem and if we have a perfectly
    // square gem (2x2, 3x3, etc) we add an extra 50 for each gem
    // (200, 100 here and 100 when the gem smashes)
    let value = this.gems.length * 100;

    if (this.width() === this.height()) {
      value += this.gems.length * 50;
    }

    return value;
  }
};
