import m from 'mithril';
import { min } from 'lodash/math';

import BaseReplayer from './replayers/base_replayer';
import ReplayPieceGenerator from './piece_generators/replay_piece_generator';
import NullRecorder from './null_recorder';

export default class BattleOpponent extends BaseReplayer {
  setup() {
    this.playSounds = false;
    this.recorder = new NullRecorder();
    this.pieceGenerator = new ReplayPieceGenerator(this.queueLength, this.seed);
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;
    this.battleState.replayLines = 0;
  }

  restart() {
    this.resetState();

    this.playerBoard.clear();
    this.playerBoard.activePiece = this.nextPiece();

    this.state.lockdelayTotal = 0;
    this.state.alive = true;
  }


  checkSync(board) {
    if (board !== this.playerBoard.toString()) {
      console.log("DESYNC");
    }
  }

  spawnNextPiece() {
    if (this.playerBoard.isClear(super.spawnPositions())) {
      this.playerBoard.activePiece = this.nextPiece();
    } else {
      if (this.battleState.lines === 0) {
        this.lose(this.playerBoard.stats.runningTime);
      } else {
        this.ko(this.playerBoard.stats.runningTime);
        this.playerBoard.activePiece = this.nextPiece();
      }
    }
  }

  spawnPositions() {
    const y = this.playerBoard.height - 1 - this.battleState.replayLines;
    return [
      { x: 2, y },
      { x: 3, y }
    ];
  }

  spawnGarbage() {
    this.battleState.lines += this.battleState.lineQueue;
    this.battleState.lineQueue = 0;
  }

  sendGarbage(damage) {
    const damageLines = Math.floor(super.sendGarbage(damage) / 6.0);
    this.sendLines(damageLines);
  }
}
