import { filter } from 'lodash/collection';
import { offsetPositions } from './helpers';

export default class Gem {
  constructor(board, x, y, colour, smasher) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.smasher = smasher;
    this.toSmash = false;
    this.cluster;
  }

  render(context) {
    context.drawImage(
      this.board.theme,
      ...this.sprite(),
      this.x * 32, (this.board.height - this.y - 1) * 32,
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


    return [
      variantOffset * 32, colourOffset * 32,
      32, 32
    ];
  }

  attemptSmash() {
    // If we are a smasher, we must have at least one other gem of the same
    // colour or we don't smash.
    if (
      this.smasher && (
        (this.leftGem()  && this.leftGem().colour  === this.colour) ||
        (this.rightGem() && this.rightGem().colour === this.colour) ||
        (this.belowGem() && this.belowGem().colour === this.colour) ||
        (this.aboveGem() && this.aboveGem().colour === this.colour)
      )
    ) {
      this.smash();
    }
  }

  smash() {
    if (this.toSmash) { return undefined; }
    this.toSmash = true;

    if (this.leftGem() && !this.leftGem().toSmash && this.leftGem().colour === this.colour) {
      this.leftGem().smash();
    }
    if (this.rightGem() && !this.rightGem().toSmash && this.rightGem().colour === this.colour) {
      this.rightGem().smash();
    }
    if (this.belowGem() && !this.belowGem().toSmash && this.belowGem().colour === this.colour) {
      this.belowGem().smash();
    }
    if (this.aboveGem() && !this.aboveGem().toSmash && this.aboveGem().colour === this.colour) {
      this.aboveGem().smash();
    }

    if (this.cluster) {
      const _this = this;
      this.cluster.gems.forEach(gem => gem.smash());
      this.board.clusters = filter(this.board.clusters, cluster => cluster !== _this.cluster)
    }
  }

  differentOrUndefined(gem) {
    return (
      gem === undefined ||
      gem && gem.cluster !== this.cluster
    );
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
