import { sample } from 'lodash/collection';
import { range } from 'lodash/util';

import Gem from '../gem';
import BasePieceGenerator from './base_piece_generator';
import { randomPercent } from '../helpers';

export default class RandomPieceGenerator extends BasePieceGenerator {
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
}
