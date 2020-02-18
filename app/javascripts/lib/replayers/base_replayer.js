import m from 'mithril';
import { filter } from 'lodash/collection';
import kissc from '../../vendor/kissc';

import Player from '../player';
import ReplayPieceGenerator from '../piece_generators/replay_piece_generator';
import { displayMilliseconds } from '../helpers';

class NullRecorder {
  constructor(gameMode) { }
  addPiece(gems) { }
  addMove(move) { }
  output() { return {} }
  toString() { return '' }
}

export default class BaseReplayer extends Player {
  setup() {
    this.loading = true;
    this.recorder = new NullRecorder();
    this.pieceGenerator = new ReplayPieceGenerator(this.queueLength);
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;
    this.playerBoard.clear();
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;
    this.state.alive = false;
    this.state.lockdelayTotal = 0;
  }

  load(data) {
    this.gameMode = data.gameMode;
    this.pieces = data.pieces;
    this.moves = data.moves;
    this.pieceGenerator.load(this.pieces);
    this.playerBoard.activePiece = this.nextPiece();
    this.loading = false;
    this.state.alive = true;
  }

  tick(delta) {
    if (this.state.alive) {
      this.playerBoard.stats.runningTime += delta;
      this.timeValue.innerText = displayMilliseconds(this.playerBoard.stats.runningTime);
      this.movesFor(delta).forEach(move => {
        this.executeMove(move);
      });
    }
  }

  executeMove(move) {
    switch (move.move) {
      case 'moveActivePieceRight': this.moveActivePieceRight(); break;
      case 'moveActivePieceLeft': this.moveActivePieceLeft(); break;
      case 'switchActivePieceGems': this.switchActivePieceGems(); break;
      case 'rotateActivePieceCW': this.rotateActivePieceCW(); break;
      case 'rotateActivePieceCCW': this.rotateActivePieceCCW(); break;
      case 'hardDrop': this.hardDrop(); break;
      case 'softDrop': this.softDrop(); break;
      case 'gravity': this.gravity(); break;
      case 'win': this.win(move.timestamp); break;
      case 'lose': this.lose(move.timestamp); break;
      default:
        console.log(`${move.move} not recognised`);
    }
  }

  movesFor(delta) {
    const _this = this;
    return filter(this.moves, move => (
      move.timestamp >= _this.playerBoard.stats.runningTime - delta &&
      move.timestamp < (_this.playerBoard.stats.runningTime)
    ));
  }
}
