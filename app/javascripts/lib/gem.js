export default class Gem {
  constructor(board, x, y, colour) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.colour = colour;
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
    let clusterOffset = 0;

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
      clusterOffset = 9;

      if (this.differentOrUndefined(this.aboveGem())) {
        if (this.differentOrUndefined(this.leftGem())) {
          clusterOffset = 1;
        } else if (this.differentOrUndefined(this.rightGem())) {
          clusterOffset = 3;
        } else {
          clusterOffset = 2;
        }
      }

      if (this.differentOrUndefined(this.rightGem())) {
        if (this.differentOrUndefined(this.aboveGem())) {
          clusterOffset = 3;
        } else if (this.differentOrUndefined(this.belowGem())) {
          clusterOffset = 6;
        } else {
          clusterOffset = 4;
        }
      }

      if (this.differentOrUndefined(this.belowGem())) {
        if (this.differentOrUndefined(this.leftGem())) {
          clusterOffset = 6;
        } else if (this.differentOrUndefined(this.rightGem())) {
          clusterOffset = 8;
        } else {
          clusterOffset = 7;
        }
      }

      if (this.differentOrUndefined(this.leftGem())) {
        if (this.differentOrUndefined(this.aboveGem())) {
          clusterOffset = 1;
        } else if (this.differentOrUndefined(this.belowGem())) {
          clusterOffset = 6;
        } else {
          clusterOffset = 5;
        }
      }
    }


    return [
      clusterOffset * 32, colourOffset * 32,
      32, 32
    ];
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
