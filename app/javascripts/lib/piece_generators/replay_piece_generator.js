import { range } from 'lodash/util';

import Gem from '../gem';

export default class ReplayPieceGenerator {
  constructor() {
    this.queueLength = 3;
    this.queue = [];
    this.replayQueue = [];
  }

  load(pieces) {
    this.replayQueue = pieces.map(piece => {
      return [
        new Gem(undefined, 0, 0, piece[0].colour, piece[0].smasher),
        new Gem(undefined, 0, 0, piece[1].colour, piece[1].smasher),
      ];
    });
    this.fillQueue();
  }

  generatePiece() {
    return this.replayQueue.shift();
  }

  nextPiece() {
    const nextPiece = this.generatePiece()
    if (nextPiece) {
      this.queue.push(nextPiece);
    }
    return this.queue.shift();
  }

  fillQueue() {
    range(0, this.queueLength).forEach(() => {
      this.queue.push(this.generatePiece());
    });
  }
}
