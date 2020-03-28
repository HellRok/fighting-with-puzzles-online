import { shuffle } from 'lodash/collection';
import { times } from 'lodash/util';

import Gem from '../gem';
import BasePieceGenerator from './base_piece_generator';

export default class BagPieceGenerator extends BasePieceGenerator{
  setup() {
    this.bag = [];
  }

  generatePiece() {
    return [
      this.pullFromBag(),
      this.pullFromBag(),
    ]
  }

  pullFromBag() {
    if (this.bag.length === 0) { this.fillBag(); };
    return this.bag.pop();
  }

  fillBag() {
    times(6, () => { this.bag.push(new Gem(undefined, 0, 0, 'red', false)) });
    times(6, () => { this.bag.push(new Gem(undefined, 0, 0, 'blue', false)) });
    times(6, () => { this.bag.push(new Gem(undefined, 0, 0, 'orange', false)) });
    times(6, () => { this.bag.push(new Gem(undefined, 0, 0, 'purple', false)) });
    this.bag.push(new Gem(undefined, 0, 0, 'red', true));
    this.bag.push(new Gem(undefined, 0, 0, 'blue', true));
    this.bag.push(new Gem(undefined, 0, 0, 'orange', true));
    this.bag.push(new Gem(undefined, 0, 0, 'purple', true));
    this.bag = shuffle(this.bag);
  }
};
