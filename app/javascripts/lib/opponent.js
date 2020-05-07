import m from 'mithril';

import BaseReplayer from './replayers/base_replayer';
import BagPieceGenerator from './piece_generators/bag_piece_generator';
import NullRecorder from './null_recorder';

export default class Opponent extends BaseReplayer {
  setup() {
    this.playSounds = false;
  }

  restart() {
    this.recorder = new NullRecorder();
    this.pieceGenerator = new BagPieceGenerator(this.queueLength, this.seed);

    this.resetState();

    this.playerBoard.clear();
    this.playerBoard.activePiece = this.nextPiece();
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;

    this.state.lockdelayTotal = 0;
  }

  checkSync(board) {
    // Do nothing for now
  }
}
