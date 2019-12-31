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

  moveActivePieceUp() {
    if (max(this.board.activePiece.map(piece => piece.y)) > 0) {
      this.board.activePiece.forEach(piece => { piece.y = piece.y + 1 });
    }
  }

  moveActivePieceDown() {
    if (min(this.board.activePiece.map(piece => piece.y)) < this.board.height - 1) {
      this.board.activePiece.forEach(piece => { piece.y = piece.y - 1 });
    }
  }

  kickActivePiece() {
    if (min(this.board.activePiece.map(piece => piece.x)) < 0) {
      this.moveActivePieceRight()
    }

    if (max(this.board.activePiece.map(piece => piece.x)) >= this.board.width) {
      this.moveActivePieceLeft()
    }

    if (min(this.board.activePiece.map(piece => piece.y)) < 0) {
      this.moveActivePieceUp()
    }

    if (max(this.board.activePiece.map(piece => piece.y)) >= this.board.height) {
      this.moveActivePieceDown()
    }
  }

  rotateActivePieceCW() {
    const centrePiece = this.board.activePiece[0];
    const offsidePiece = this.board.activePiece[1];

    if (centrePiece.x === offsidePiece.x) {
      if (centrePiece.y > offsidePiece.y) {
        offsidePiece.y = centrePiece.y;
        offsidePiece.x = centrePiece.x - 1;
      } else {
        offsidePiece.y = centrePiece.y;
        offsidePiece.x = centrePiece.x + 1;
      }
    } else {
      if (centrePiece.x > offsidePiece.x) {
        offsidePiece.x = centrePiece.x;
        offsidePiece.y = centrePiece.y + 1;
      } else {
        offsidePiece.x = centrePiece.x;
        offsidePiece.y = centrePiece.y - 1;
      }
    }
  }

  rotateActivePieceCCW() {
    const centrePiece = this.board.activePiece[0];
    const offsidePiece = this.board.activePiece[1];

    if (centrePiece.x === offsidePiece.x) {
      if (centrePiece.y > offsidePiece.y) {
        offsidePiece.y = centrePiece.y;
        offsidePiece.x = centrePiece.x + 1;
      } else {
        offsidePiece.y = centrePiece.y;
        offsidePiece.x = centrePiece.x - 1;
      }
    } else {
      if (centrePiece.x > offsidePiece.x) {
        offsidePiece.x = centrePiece.x;
        offsidePiece.y = centrePiece.y - 1;
      } else {
        offsidePiece.x = centrePiece.x;
        offsidePiece.y = centrePiece.y + 1;
      }
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
      this.kickActivePiece();
      this.keyState.cw = false;
    }

    if (this.keyState.ccw) {
      this.rotateActivePieceCCW();
      this.kickActivePiece();
      this.keyState.ccw = false;
    }
  }

  tick(delta) {
    this.input();
  }
}
