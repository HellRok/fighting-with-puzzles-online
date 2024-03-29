import m from 'mithril';
import { filter } from 'lodash/collection';
import { min } from 'lodash/math';

import Player from '../player';
import Gem from '../gem';
import Settings from '../settings';
import Api from '../api';
import ReplayPieceGenerator from '../piece_generators/replay_piece_generator';
import NullRecorder from '../null_recorder';
import { displayMilliseconds, offsetPositions } from '../helpers';

export default class BaseReplayer extends Player {
  setup() {
    this.loading = true;
    this.recorder = new NullRecorder();
    this.pieceGenerator = new ReplayPieceGenerator(this.queueLength);
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;
    this.playerBoard.clear();
    this.state.alive = false;
    this.state.replay = true;
    this.state.lockdelayTotal = 0;
    this.state.lastMoveTimestamp = 0;
  }

  load(id) {
    Api.replaysFind(id).then(replay => {
      this.user = replay.user;
      this.gameMode = replay.parsedData().gameMode;
      this.pieces = replay.parsedData().pieces;
      this.moves = replay.parsedData().moves;
      this.pieceGenerator.load(this.pieces);
      this.playerBoard.activePiece = this.nextPiece();
      this.loading = false;
      this.countdown();
    });
  }

  loadReplay(replay) {
    this.setup();
    this.user = replay.user;
    this.gameMode = replay.parsedData().gameMode;
    this.pieces = replay.parsedData().pieces;
    this.moves = replay.parsedData().moves;
    this.pieceGenerator.load(this.pieces);
    this.playerBoard.activePiece = this.nextPiece();
    this.loading = false;
  }

  tick(delta) {
    if (this.state.alive) {
      this.playerBoard.stats.runningTime += delta;
      if (this.timeValue) {
        this.timeValue.innerText = displayMilliseconds(this.playerBoard.stats.runningTime);
      }

      this.movesFor(delta).forEach(move => {
        this.executeMove(move, delta);
      });
    }
  }

  executeMove(move, delta=0) {
    switch (move.move) {
      case 'moveActivePieceRight': this.moveActivePieceRight(); break;
      case 'moveActivePieceLeft': this.moveActivePieceLeft(); break;
      case 'switchActivePieceGems': this.switchActivePieceGems(); break;
      case 'rotateActivePieceCW': this.rotateActivePieceCW(); break;
      case 'rotateActivePieceCCW': this.rotateActivePieceCCW(); break;
      case 'hardDrop': this.hardDrop(); break;
      case 'softDrop': this.softDrop(); break;
      case 'gravity': this.gravity(); break;
      case 'gravityLock': this.lock(); break;
      case 'dump': this.dump(); break;
      case 'queueGarbage': this.queueGarbage(move.options.column, move.options.colour); break;
      case 'spawnGarbage': this.spawnGarbage(); break;
      case 'currentLines': this.battleState.replayLines = move.options.lines; break;
      case 'win': this.win(move.timestamp); break;
      case 'lose': this.lose(move.timestamp); break;
      case 'boardData': this.checkSync(move.options.data); break;
      default:
        if (Settings.debug) {
          console.log(`${move.move} not recognised`);
        }
    }
  }

  softDrop() {
    this.gravityTimestamp = 0;
  }

  gravity() {
    this.moveActivePieceDown();
  }

  dump() {
    this.nextDumpAt = 5000 + (1000 * this.dumpMultiplier);
    this.dumpTotal += 1;
    this.dumpMultiplier = min([this.dumpTotal * 2, 24]);
  }

  checkSync(board) {
    if (board !== this.playerBoard.toString()) {
      console.log("DESYNC DETECTED");
      console.log(`Expected: ${board}`);
      console.log(`Got:      ${this.playerBoard.toString()}`);
    }
  }

  queueGarbage(column, colour) {
    this.garbageQueue.push(new Gem(undefined,
      column, this.playerBoard.height - 1,
      colour, false, 5,
    ));
    m.redraw();
  }

  movesFor(delta) {
    const oldLastMoveTimestamp = this.state.lastMoveTimestamp;
    this.state.lastMoveTimestamp = this.playerBoard.stats.runningTime;
    return filter(this.moves, move => (
      move.timestamp >= oldLastMoveTimestamp &&
      move.timestamp < (this.playerBoard.stats.runningTime)
    ));
  }
}
