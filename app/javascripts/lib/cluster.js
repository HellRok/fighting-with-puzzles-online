import { min } from 'lodash/math';

export default class Gem {
  constructor(gems) {
    self.gems = gems;
    console.log(gems);
    self.width;
    self.height;
  }

  left() {
    self.x = min(self.gems.map(gem => gem.x));
  }

  right() {
    self.x = max(self.gems.map(gem => gem.x));
  }

  bottom() {
    self.y = min(self.gems.map(gem => gem.y));
  }

  top() {
    self.y = max(self.gems.map(gem => gem.y));
  }

  leftGems() {
    if (this.x === 0) { return undefined };
    return this.board.getGem(this.x - 1, this.y);
  }

  rightGem() {
    if (this.x === (this.board.width - 1)) { return undefined };
    return this.board.getGem(this.x + 1, this.y);
  }

  belowGem() {
    if (this.y === 0) { return undefined };
    return this.board.getGem(this.x, this.y - 1);
  }

  aboveGem() {
    if (this.y === (this.board.height - 1)) { return undefined };
    return this.board.getGem(this.x, this.y + 1);
  }

  attemptGrowth() {
    // Growth order is up > right > left > down

  }
};
