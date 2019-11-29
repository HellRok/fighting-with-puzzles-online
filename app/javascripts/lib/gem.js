import m from 'mithril';

export default class Gem {
  constructor(board, x, y, colour) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.cluster;
  }

  view() {
    // Temporary for debugging
    return m('.gem', {
      style: {
        position: 'absolute',
        left: `${this.x * 1.5}rem`,
        top: `${(this.board.height - this.y) * 2}rem`,
        color: this.colour,
      }
    }, '0');
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

  aboveRightGem() {
    if (
      this.y === (this.board.height - 1) ||
      this.x === (this.board.width - 1)
    ) { return undefined; }

    return this.board.getSquare(this.x + 1, this.y + 1);
  }
};
