import { sample } from 'lodash/collection';
import { min, max } from 'lodash/math';

import Gem from './gem';
import { timestamp } from './helpers';

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
    this.settings = {
      das: 500,
      arr: 100,
    }
  }

  nextPiece() {
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
    if (max(this.board.activePiece.map(piece => piece.x)) < this.board.width - 1) {
      this.board.activePiece.forEach(piece => { piece.x = piece.x + 1 });
    }
  }

  moveActivePieceLeft() {
    if (min(this.board.activePiece.map(piece => piece.x)) > 0) {
      this.board.activePiece.forEach(piece => { piece.x = piece.x - 1 });
    }
  }

  keyDown(event) {
    if (event.keyCode === window.keys.right) {
      this.keyState.right = true;
    }
    if (event.keyCode === window.keys.left) {
      this.keyState.left = true;
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
  }

  tick(delta) {
    this.input();
  }
}
