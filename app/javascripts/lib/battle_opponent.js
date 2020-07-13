import m from 'mithril';

import BaseReplayer from './replayers/base_replayer';
import ReplayPieceGenerator from './piece_generators/replay_piece_generator';
import NullRecorder from './null_recorder';

export default class BattleOpponent extends BaseReplayer {
  setup() {
    this.playSounds = false;
    this.recorder = new NullRecorder();
    this.pieceGenerator = new ReplayPieceGenerator(this.queueLength, this.seed);
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;
  }

  restart() {
    this.resetState();

    this.playerBoard.clear();
    this.playerBoard.activePiece = this.nextPiece();

    this.state.lockdelayTotal = 0;
    this.state.alive = true;
  }

  checkSync(board) {
    // Do nothing for now
  }
}
