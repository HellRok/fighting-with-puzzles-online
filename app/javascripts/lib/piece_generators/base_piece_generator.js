import { sample } from 'lodash/collection';
import { range } from 'lodash/util';

import Gem from '../gem';
import Random from '../random';

export default class BasePieceGenerator {
  constructor(queueLength, seed=Date.now()) {
    this.prng = new Random(seed);
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
