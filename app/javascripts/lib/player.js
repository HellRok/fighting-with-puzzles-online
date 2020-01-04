import { sample, sortBy } from 'lodash/collection';
import { min, max } from 'lodash/math';

import Gem from './gem';
import { timestamp, offsetPositions } from './helpers';

window.keys = {
  left:     65,
  right:    69,
  hardDrop: 188,
  softDrop: 79,
  ccw:      67,
  cw:       48,
  switch:   221,
};

export default class Player {
  constructor(board) {
    this.board = board;
    this.board.activePiece = this.nextPiece();

    const _this = this;
    this.keyDownEvent = document.addEventListener('keydown', (e) => { _this.keyDown(e) }, false);
    this.keyUpEvent   = document.addEventListener('keyup',   (e) => { _this.keyUp(e) },   false);
    this.keyState = {
      left:     false, leftTimestamp:  0,
      right:    false, rightTimestamp: 0,
      hardDrop: false,
      softDrop: false,
      ccw:      false,
      cw:       false,
      switch:   false,
    }
    this.state = {
      gravityTimestamp: 0,
    }
    this.settings = {
      das: 500,
      arr: 100,
    }
  }

  nextPiece() {
    this.gravityTimestamp = timestamp();

    return [
      new Gem(this.board, 2, this.board.height - 1,
        sample(['red', 'blue', 'orange', 'purple'])
      ),
      new Gem(this.board, 3, this.board.height - 1,
        sample(['red', 'blue', 'orange', 'purple'])
      ),
    ]
  }

  moveActivePieceRight() {
    if (this.board.isClear(offsetPositions(this.board.activePiece, [1, 0]))) {
      this.board.activePiece.forEach(piece => { piece.x = piece.x + 1 });
    }
  }

  moveActivePieceLeft() {
    if (this.board.isClear(offsetPositions(this.board.activePiece, [-1, 0]))) {
      this.board.activePiece.forEach(piece => { piece.x = piece.x - 1 });
    }
  }

  moveActivePieceUp() {
    if (this.board.isClear(offsetPositions(this.board.activePiece, [0, 1]))) {
      this.board.activePiece.forEach(piece => { piece.y = piece.y + 1 });
    }
  }

  moveActivePieceDown() {
    if (this.board.isClear(offsetPositions(this.board.activePiece, [0, -1]))) {
      this.board.activePiece.forEach(piece => { piece.y = piece.y - 1 });
    }
  }

  kick(pieces) {
    if (this.board.isClear(pieces)) {
      return pieces;
    }

    // Next to each other, so only kick left/right
    if (pieces[0].y === pieces[1].y) {
      if (this.board.isClear(offsetPositions(pieces, [1, 0]))) {
        return offsetPositions(pieces, [1, 0]);
      }

      if (this.board.isClear(offsetPositions(pieces, [-1, 0]))) {
        return offsetPositions(pieces, [-1, 0]);
      }
    }

    // One above the other, so only kick up/down
    if (pieces[0].x === pieces[1].x) {
      if (this.board.isClear(offsetPositions(pieces, [0, 1]))) {
        return offsetPositions(pieces, [0, 1]);
      }

      if (this.board.isClear(offsetPositions(pieces, [0, -1]))) {
        return offsetPositions(pieces, [0, -1]);
      }
    }

    return false;
  }

  rotateActivePieceCW() {
    const centrePiece = this.board.activePiece[0];
    const offsidePiece = this.board.activePiece[1];
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
    const centrePiece = this.board.activePiece[0];
    const offsidePiece = this.board.activePiece[1];
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

  keyDown(event) {
    if (event.keyCode === window.keys.right) {
      this.keyState.right = true;
    }

    if (event.keyCode === window.keys.left) {
      this.keyState.left = true;
    }

    if (event.keyCode === window.keys.cw) {
      this.keyState.cw = true;
    }

    if (event.keyCode === window.keys.ccw) {
      this.keyState.ccw = true;
    }

    if (event.keyCode === window.keys.hardDrop) {
      this.keyState.hardDrop = true;
    }

    if (event.keyCode === window.keys.softDrop) {
      this.keyState.softDrop = true;
    }
  }

  keyUp(event) {
    if (event.keyCode === window.keys.right) {
      this.keyState.right = false;
      this.keyState.rightTimestamp = 0;
    }

    if (event.keyCode === window.keys.left) {
      this.keyState.left = false;
      this.keyState.leftTimestamp = 0;
    }
  }

  input() {
    // TODO: real das/arr
    if (this.keyState.right) {
      if (timestamp() - this.keyState.rightTimestamp > this.settings.das) {
        this.keyState.rightTimestamp = timestamp();
        this.moveActivePieceRight();
      }
    }

    if (this.keyState.left) {
      if (timestamp() - this.keyState.leftTimestamp > this.settings.das) {
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

    if (this.keyState.hardDrop) {
      this.lock();
      this.keyState.hardDrop = false;
    }

    if (this.keyState.softDrop) {
      this.gravityTimestamp = 0;
      this.gravity();
      this.keyState.softDrop = false;
    }
  }

  gravity() {
    if ((timestamp() - this.gravityTimestamp) > 500) {
      this.gravityTimestamp = timestamp();
      let collision = false;

      if (!this.board.isClear(offsetPositions(this.board.activePiece, [0, -1]))) {
        collision = true;
      }

      if (collision) {
        this.lock();
      } else {
        this.moveActivePieceDown();
      }
    }
  }

  lock() {
    if (this.board.activePiece[0].y !== this.board.activePiece[1].y) {
      this.board.activePiece = sortBy(this.board.activePiece, gem => gem.y)
    }

    this.board.activePiece.forEach(gem => {
      while (this.board.isClear(offsetPositions([gem], [0, -1]))) {
        gem.y = gem.y - 1;
      }
      this.board.setSquare(gem);
    });

    this.board.activePiece = this.nextPiece();
    this.board.update();
  }

  tick(delta) {
    this.input();
    this.gravity();
  }
}
