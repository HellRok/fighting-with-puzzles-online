import { sample } from 'lodash/collection';
import { range } from 'lodash/util';

import Gem from '../gem';

export default class BasePieceGenerator {
  constructor(queueLength) {
    this.queueLength = queueLength;
    this.queue = [];
    this.setup();
    this.fillQueue();
  }

  setup() {
    // Override in the extended class
  }

  nextPiece() {
    this.queue.push(this.generatePiece());
    return this.queue.shift();
  }

  fillQueue() {
    range(0, this.queueLength).forEach(() => {
      this.queue.push(this.generatePiece());
    });
  }
};
