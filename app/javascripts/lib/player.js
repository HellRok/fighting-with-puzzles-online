import { sortBy } from 'lodash/collection';
import { min, max } from 'lodash/math';

import Gem from './gem';
import Settings from './settings';
import RandomPieceGenerator from './piece_generators/random_piece_generator';
import { timestamp, offsetPositions } from './helpers';

export default class Player {
  constructor(playerBoard, boards=[]) {
    this.playerBoard = playerBoard;
    this.playerBoard.debug.show = true;
    this.playerBoard.game = this;
    this.boards = boards;
    this.queueLength = 3;
    this.gravityTimeout = 500;
    this.lockdelayTimeout = 350;
    this.lockdelayMax = 5000;
    this.timeValue = document.querySelector('.stats .time .value');
    this.lockdelayElement = document.querySelector('.lockdelay-progress');

    const _this = this;
    this.keyDownEvent = document.addEventListener('keydown', (e) => { _this.keyDown(e) }, false);
    this.keyUpEvent   = document.addEventListener('keyup',   (e) => { _this.keyUp(e) },   false);
    this.resetKeystate();
    this.state = {
      lastGameLoopTimestamp:   timestamp(),
      lastRenderLoopTimestamp: timestamp(),
      gravityTimestamp:        0,
      lockdelayTotal:          0,
      alive:                   false,
      toBeDestroyed:           false,
    }

    this.setup();
  }

  resetKeystate() {
    this.keyState = {
      restart:    false,
      autoRepeat: false,
      left:       false, leftTimestamp:  0,
      right:      false, rightTimestamp: 0,
      hardDrop:   false,
      softDrop:   false,
      ccw:        false,
      cw:         false,
      switch:     false,
    }
  }

  restart() {
    this.setup();
    this.pieceGenerator = new RandomPieceGenerator(this.queueLength);
    this.resetKeystate();
    this.playerBoard.clear();
    this.playerBoard.activePiece = this.nextPiece();
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;
    this.state.alive = true;
    this.state.lockdelayTotal = 0;
  }

  destroy() {
    this.state.toBeDestroyed = true;
  }

  gameLoop() {
    const _this = this;
    const newTimestamp = timestamp();
    const delta = newTimestamp - this.state.lastGameLoopTimestamp;
    this.state.lastGameLoopTimestamp = newTimestamp;

    this.playerBoard.debug.gameTick = delta;

    this.tick(delta);
    if (!this.state.toBeDestroyed) {
      setTimeout(() => _this.gameLoop(), 1);
    }
  }

  renderLoop() {
    const _this = this;
    const newTimestamp = timestamp();
    const delta = newTimestamp - this.state.lastRenderLoopTimestamp;
    this.state.lastRenderLoopTimestamp = newTimestamp;

    this.playerBoard.debug.renderTick = delta;

    this.playerBoard.render();
    this.boards.forEach(board => board.render());
    if (!this.state.toBeDestroyed) {
      window.requestAnimationFrame(() => _this.renderLoop())
    }
  }

  nextPiece() {
    this.gravityTimestamp = timestamp();
    const gems = this.pieceGenerator.nextPiece();
    gems[0].board = this.playerBoard;
    gems[0].x = 2;
    gems[0].y = this.playerBoard.height - 1;
    gems[1].board = this.playerBoard;
    gems[1].x = 3;
    gems[1].y = this.playerBoard.height - 1;

    this.recorder.addPiece(gems);

    return gems;
  }

  moveActivePieceRight() {
    if (this.playerBoard.isClear(offsetPositions(this.playerBoard.activePiece, [1, 0]))) {
      this.recorder.addMove('moveActivePieceRight');
      this.playerBoard.activePiece.forEach(piece => { piece.x = piece.x + 1 });
    }
  }

  moveActivePieceLeft() {
    if (this.playerBoard.isClear(offsetPositions(this.playerBoard.activePiece, [-1, 0]))) {
      this.recorder.addMove('moveActivePieceLeft');
      this.playerBoard.activePiece.forEach(piece => { piece.x = piece.x - 1 });
    }
  }

  moveActivePieceUp() {
    if (this.playerBoard.isClear(offsetPositions(this.playerBoard.activePiece, [0, 1]))) {
      this.playerBoard.activePiece.forEach(piece => { piece.y = piece.y + 1 });
    }
  }

  moveActivePieceDown() {
    if (this.playerBoard.isClear(offsetPositions(this.playerBoard.activePiece, [0, -1]))) {
      this.playerBoard.activePiece.forEach(piece => { piece.y = piece.y - 1 });
    }
  }

  switchActivePieceGems() {
    this.recorder.addMove('switchActivePieceGems');
    [this.playerBoard.activePiece[0], this.playerBoard.activePiece[1]] =
      [this.playerBoard.activePiece[1], this.playerBoard.activePiece[0]];
    [this.playerBoard.activePiece[0].x, this.playerBoard.activePiece[1].x] =
      [this.playerBoard.activePiece[1].x, this.playerBoard.activePiece[0].x];
    [this.playerBoard.activePiece[0].y, this.playerBoard.activePiece[1].y] =
      [this.playerBoard.activePiece[1].y, this.playerBoard.activePiece[0].y];
  }

  kick(pieces) {
    if (this.playerBoard.isClear(pieces)) {
      return pieces;
    }

    // Next to each other, so only kick left/right
    if (pieces[0].y === pieces[1].y) {
      if (this.playerBoard.isClear(offsetPositions(pieces, [1, 0]))) {
        return offsetPositions(pieces, [1, 0]);
      }

      if (this.playerBoard.isClear(offsetPositions(pieces, [-1, 0]))) {
        return offsetPositions(pieces, [-1, 0]);
      }
    }

    // One above the other, so only kick up/down
    if (pieces[0].x === pieces[1].x) {
      if (this.playerBoard.isClear(offsetPositions(pieces, [0, 1]))) {
        return offsetPositions(pieces, [0, 1]);
      }

      if (this.playerBoard.isClear(offsetPositions(pieces, [0, -1]))) {
        return offsetPositions(pieces, [0, -1]);
      }
    }

    return false;
  }

  rotateActivePieceCW() {
    this.recorder.addMove('rotateActivePieceCW');
    const centrePiece = this.playerBoard.activePiece[0];
    const offsidePiece = this.playerBoard.activePiece[1];
    const translation = { x: 0, y: 0 }

    if (centrePiece.x === offsidePiece.x) {
      if (centrePiece.y > offsidePiece.y) {
        translation.y = centrePiece.y;
        translation.x = centrePiece.x - 1;
      } else {
        translation.y = centrePiece.y;
        translation.x = centrePiece.x + 1;
      }
    } else {
      if (centrePiece.x > offsidePiece.x) {
        translation.x = centrePiece.x;
        translation.y = centrePiece.y + 1;
      } else {
        translation.x = centrePiece.x;
        translation.y = centrePiece.y - 1;
      }
    }

    const newPositions = this.kick([
      { x: centrePiece.x, y: centrePiece.y },
      translation
    ]);

    if (newPositions) {
      centrePiece.x  = newPositions[0].x;
      centrePiece.y  = newPositions[0].y;
      offsidePiece.x = newPositions[1].x;
      offsidePiece.y = newPositions[1].y;
    }
  }

  rotateActivePieceCCW() {
    this.recorder.addMove('rotateActivePieceCCW');
    const centrePiece = this.playerBoard.activePiece[0];
    const offsidePiece = this.playerBoard.activePiece[1];
    const translation = { x: 0, y: 0 }

    if (centrePiece.x === offsidePiece.x) {
      if (centrePiece.y > offsidePiece.y) {
        translation.y = centrePiece.y;
        translation.x = centrePiece.x + 1;
      } else {
        translation.y = centrePiece.y;
        translation.x = centrePiece.x - 1;
      }
    } else {
      if (centrePiece.x > offsidePiece.x) {
        translation.x = centrePiece.x;
        translation.y = centrePiece.y - 1;
      } else {
        translation.x = centrePiece.x;
        translation.y = centrePiece.y + 1;
      }
    }

    const newPositions = this.kick([
      { x: centrePiece.x, y: centrePiece.y },
      translation
    ]);

    if (newPositions) {
      centrePiece.x  = newPositions[0].x;
      centrePiece.y  = newPositions[0].y;
      offsidePiece.x = newPositions[1].x;
      offsidePiece.y = newPositions[1].y;
    }
  }

  hardDrop() {
    this.recorder.addMove('hardDrop')
    this.lock();
  }

  softDrop() {
    this.recorder.addMove('softDrop')
    this.gravityTimestamp = 0;
    this.gravity();
  }

  keyDown(event) {
    if (event.keyCode === Settings.keys.restart) {
      this.keyState.restart = true;
    }

    if (event.keyCode === Settings.keys.right) {
      this.keyState.right = true;
    }

    if (event.keyCode === Settings.keys.left) {
      this.keyState.left = true;
    }

    if (event.keyCode === Settings.keys.cw) {
      this.keyState.cw = true;
    }

    if (event.keyCode === Settings.keys.ccw) {
      this.keyState.ccw = true;
    }

    if (event.keyCode === Settings.keys.switch) {
      this.keyState.switch = true;
    }

    if (event.keyCode === Settings.keys.hardDrop) {
      this.keyState.hardDrop = true;
    }

    if (event.keyCode === Settings.keys.softDrop) {
      this.keyState.softDrop = true;
    }
  }

  keyUp(event) {
    if (event.keyCode === Settings.keys.right) {
      this.keyState.right = false;
      this.keyState.rightTimestamp = 0;
      this.keyState.autoRepeat = false;
    }

    if (event.keyCode === Settings.keys.left) {
      this.keyState.left = false;
      this.keyState.leftTimestamp = 0;
      this.keyState.autoRepeat = false;
    }
  }

  input() {
    this.state.alive ? this.aliveInput() : this.deadInput();
  }

  aliveInput() {
    const movementDelay = this.keyState.autoRepeat ? Settings.game.arr : Settings.game.das;

    if (this.keyState.restart) {
      this.attemptRestart();
    }

    if (this.keyState.right) {
      if (timestamp() - this.keyState.rightTimestamp > movementDelay) {
        if (!this.keyState.autoRepeat && this.keyState.rightTimestamp !== 0) { this.keyState.autoRepeat = true; }
        this.keyState.rightTimestamp = timestamp();
        this.moveActivePieceRight();
      }
    }

    if (this.keyState.left) {
      if (timestamp() - this.keyState.leftTimestamp > movementDelay) {
        if (!this.keyState.autoRepeat && this.keyState.leftTimestamp !== 0) { this.keyState.autoRepeat = true; }
        this.keyState.leftTimestamp = timestamp();
        this.moveActivePieceLeft();
      }
    }

    if (this.keyState.cw) {
      this.rotateActivePieceCW();
      this.keyState.cw = false;
    }

    if (this.keyState.ccw) {
      this.rotateActivePieceCCW();
      this.keyState.ccw = false;
    }

    if (this.keyState.switch) {
      this.switchActivePieceGems();
      this.keyState.switch = false;
    }

    if (this.keyState.hardDrop) {
      this.hardDrop();
      this.keyState.hardDrop = false;
    }

    if (this.keyState.softDrop) {
      this.softDrop();
      this.keyState.softDrop = false;
    }
  }

  gravity(delta) {
    if (this.playerBoard.isClear(offsetPositions(this.playerBoard.activePiece, [0, -1]))) {
      this.lockdelayElement.style.width = '100%';
      if ((timestamp() - this.gravityTimestamp) > this.gravityTimeout) {
        this.recorder.addMove('gravity');
        this.gravityTimestamp = timestamp();
        this.moveActivePieceDown();
      }
    } else {
      // If there is a piece below us it's time to implement lockdelay instead
      // of regular gravity, but first, we make sure the player isn't stalling
      // forever, which doesn't really matter in single player games but come
      // multiplayer would be a big issue
      this.state.lockdelayTotal += delta;

      if (this.state.lockdelayTotal >= this.lockdelayMax) { this.lock(); }

      this.lockdelayElement.style.width = `${100 - (timestamp() - this.gravityTimestamp) / this.lockdelayTimeout * 100}%`;
      if ((timestamp() - this.gravityTimestamp) > this.lockdelayTimeout) {
        this.gravityTimestamp = timestamp();
        this.lock();
      }
    }
  }

  lock() {
    // It's important to order this so we always drop the bottom piece first or
    // we can get into some real funky situations of gems overriding each other
    // or dropping in an unexpected order.
    if (this.playerBoard.activePiece[0].y !== this.playerBoard.activePiece[1].y) {
      this.playerBoard.activePiece = sortBy(this.playerBoard.activePiece, gem => gem.y)
    }

    this.playerBoard.activePiece.forEach(gem => {
      gem.gravity();
    });

    if (
      this.playerBoard.getSquare(2, this.playerBoard.height - 1) ||
      this.playerBoard.getSquare(3, this.playerBoard.height - 1)
    ) {
      this.lose();
    }

    this.playerBoard.activePiece = this.nextPiece();
    this.playerBoard.update();
  }

  tick(delta) {
    throw 'Tick must be overloaded in child class';
  }

  deadInput() {
    throw 'DeadInput must be overloaded in child class';
  }

  attemptRestart() {
    // In live games this will do either nothing or drop them in a practice
    // mode until the next game.
    throw 'AttemptRestart must be overloaded in child class';
  }

  setup() {
    throw 'Setup must be overloaded in child class';
  }

  lose() {
    throw 'Lose must be overloaded in child class';
  }

  win() {
    throw 'Win must be overloaded in child class';
  }
}
