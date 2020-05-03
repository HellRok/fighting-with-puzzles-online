import { pullAt } from 'lodash/array';

import BagPieceGenerator from './bag_piece_generator';

export default class SprintPieceGenerator extends BagPieceGenerator {
  pullFromBag() {
    if (this.bag.length === 0) { this.fillBag(); };
    return pullAt(this.bag, this.prng.max(this.bag.length))[0];
  }
};

