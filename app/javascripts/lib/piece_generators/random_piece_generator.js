import Gem from '../gem';
import BasePieceGenerator from './base_piece_generator';

export default class RandomPieceGenerator extends BasePieceGenerator {
  generatePiece() {
    return [
      new Gem(undefined, 0, 0,
        ['red', 'blue', 'orange', 'purple'][this.prng.max(4)],
        ((this.prng.max(100) + 1) > 80)
      ),
      new Gem(undefined, 0, 0,
        ['red', 'blue', 'orange', 'purple'][this.prng.max(4)],
        ((this.prng.max(100) + 1) > 80)
      ),
    ]
  }
}
