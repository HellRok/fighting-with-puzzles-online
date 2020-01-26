import { sample } from 'lodash/collection';
import { range } from 'lodash/util';

import Gem from '../gem';
import { timestamp, offsetPositions, randomPercent } from '../helpers';

export default class PieceGeneratorRandom {
  constructor(queueLength) {
    this.queueLength = queueLength;
    this.fillQueue();
  }

  generatePiece() {
    return [
      new Gem(undefined, 0, 0,
        sample(['red', 'blue', 'orange', 'purple']),
        (randomPercent() > 80)
      ),
      new Gem(undefined, 0, 0,
        sample(['red', 'blue', 'orange', 'purple']),
        (randomPercent() > 80)
      ),
    ]
  }

  nextPiece() {
    this.queue.push(this.generatePiece());
    return this.queue.shift();
  }

  fillQueue() {
    this.queue = [];

    range(0, this.queueLength).forEach(() => {
      this.queue.push(this.generatePiece());
    });
  }
}
