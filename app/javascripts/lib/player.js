import m from 'mithril';
import { filter, sortBy } from 'lodash/collection';
import { last } from 'lodash/array';
import { min, max, sum } from 'lodash/math';

import Gem from './gem';
import Settings from './settings';
import Audio from './audio';
import Flash from './flash';
import BagPieceGenerator from './piece_generators/bag_piece_generator';
import { displayMilliseconds, timestamp, offsetPositions, keyboardMap } from './helpers';

export default class Player {
  constructor(playerBoard, seed) {
    this.forcedSeed = seed;
    this.playerBoard = playerBoard;
    this.playerBoard.debug.show = true;
    // TODO: Bring these two to just be player (or change replay to use game)
    this.playerBoard.game = this;
    this.playerBoard.player = this;

    this.opponents = [];
    this.queueLength = 3;
    this.gravityTimeout = 500;
    this.lockdelayTimeout = 350;
    this.lockdelayMax = 5000;
    this.playSounds = true;
    this.timeValue = document.querySelector('.stats .time .value');
    this.lockdelayElement = document.querySelector('.lockdelay-progress');

    const _this = this;
    this.keyDownEvent = (e) => { _this.keyDown(e) };
    document.addEventListener('keydown', this.keyDownEvent, false);
    this.keyUpEvent = (e) => { _this.keyUp(e) }
    document.addEventListener('keyup', this.keyUpEvent, false);

    this.resetKeystate();
    this.resetState();

    this.setup();
  }

  changeState(newState) {
    if (this.gameState) { this.gameState.teardown(); }
    this.gameState = new newState(this);
  }

  resetState() {
    this.garbageQueue = [];
    this.garbageSent = [];
    this.state = {
      lastGameLoopTimestamp:   timestamp(),
      lastRenderLoopTimestamp: timestamp(),
      gravityTotal:            0,
      lockdelayTotal:          0,
      locking:                 false,
      alive:                   false,
      toBeDestroyed:           false,
    };
    this.battleState = {
      kos:                     0,
      lineQueue:               0,
      lines:                   0,
      replayLines:             0,
    }
  }

  resetKeystate() {
    this.keyState = {
      autoRepeat: false,
      restart:    false, restartHandled:  true,
      left:       false, leftHandled:     true, leftTotal:  0,
      right:      false, rightHandled:    true, rightTotal: 0,
      hardDrop:   false, hardDropHandled: true,
      softDrop:   false, softDropHandled: true,
      ccw:        false, ccwHandled:      true,
      cw:         false, cwHandled:       true,
      switch:     false, switchHandled:   true,
    };
  }

  setupPieceGenerator() {
    this.pieceGenerator = new BagPieceGenerator(this.queueLength, this.seed);
    this.pieceGenerator.queue.forEach(gems => this.recorder.addPiece(gems));
  }

  setSeed() {
    this.seed = (this.forcedSeed || Date.now());
  }

  restart() {
    this.setSeed();
    this.setup();
    this.setupPieceGenerator();

    this.resetKeystate();
    this.resetState();

    this.playerBoard.clear();
    this.playerBoard.activePiece = this.nextPiece();
    this.playerBoard.pieceQueue = this.pieceGenerator.queue;

    this.state.lockdelayTotal = 0;

    this.countdown();
  }

  countdown() {
    clearTimeout(this.countinTimer);
    clearTimeout(this.goTimer);

    this.playerBoard.overlay = 'Ready';
    m.redraw();

    this.countinTimer = setTimeout(() => {
      this.playerBoard.overlay = 'Go!';
      m.redraw();

      this.goTimer = setTimeout(() => {
        this.playerBoard.overlay = undefined;
        m.redraw();
        this.state.alive = true;
        if (this.opponentBoard) {
          this.opponentBoard.player.state.alive = true;
        }
        this.playerBoard.stats.start = timestamp();
      }, 250);
    }, 1000);
  }

  destroy() {
    this.state.toBeDestroyed = true;
    clearTimeout(this.countinTimer);
    clearTimeout(this.goTimer);
    document.removeEventListener('keydown', this.keyDownEvent);
    document.removeEventListener('keyup', this.keyUpEvent);
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
    this.opponents.forEach(opponent => opponent.playerBoard.render());
    if (!this.state.toBeDestroyed) {
      window.requestAnimationFrame(() => _this.renderLoop())
    }

    if (this.opponentBoard) {
      this.opponentBoard.render();
    }
  }

  nextPiece() {
    this.gravityTotal = 0;
    const gems = this.pieceGenerator.nextPiece();
    const positions = this.spawnPositions();
    gems[0].board = this.playerBoard;
    gems[0].x = positions[0].x;
    gems[0].y = positions[0].y;
    gems[1].board = this.playerBoard;
    gems[1].x = positions[1].x;
    gems[1].y = positions[1].y;

    this.recorder.addPiece(last(this.pieceGenerator.queue));

    return gems;
  }

  spawnPositions() {
    const y = this.playerBoard.height - 1 - this.playerBoard.offset().y;
    return [
      { x: 2, y },
      { x: 3, y }
    ];
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

  softDrop(delta) {
    // We don't record softdrop because gravity is already recorded
    this.gravityTimeout = 125;
    this.gravityTotal = this.gravityTimeout;
    this.gravity(delta);
  }

  keyDown(event) {
    // We only care to catch the key presses for our game
    if (Object.values(Settings.keys).indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }

    if (event.keyCode === Settings.keys.restart && !this.keyState.restart) {
      this.keyState.restart = true;
      this.keyState.restartHandled = false;
    }

    if (event.keyCode === Settings.keys.right && !this.keyState.right) {
      this.keyState.right = true;
      this.keyState.rightHandled = false;
    }

    if (event.keyCode === Settings.keys.left && !this.keyState.left) {
      this.keyState.left = true;
      this.keyState.leftHandled = false;
    }

    if (event.keyCode === Settings.keys.cw && !this.keyState.cw) {
      this.keyState.cw = true;
      this.keyState.cwHandled = false;
    }

    if (event.keyCode === Settings.keys.ccw && !this.keyState.ccw) {
      this.keyState.ccw = true;
      this.keyState.ccwHandled = false;
    }

    if (event.keyCode === Settings.keys.switch && !this.keyState.switch) {
      this.keyState.switch = true;
      this.keyState.switchHandled = false;
    }

    if (event.keyCode === Settings.keys.hardDrop && !this.keyState.hardDrop) {
      this.keyState.hardDrop = true;
      this.keyState.hardDropHandled = false;
    }

    if (event.keyCode === Settings.keys.softDrop && !this.keyState.softDrop) {
      this.gravityTotal = 0;
      this.keyState.softDrop = true;
      this.keyState.softDropHandled = false;
    }
  }

  keyUp(event) {
    if (event.keyCode === Settings.keys.restart) {
      this.keyState.restart = false;
      this.keyState.restartHandled = false;
    }

    if (event.keyCode === Settings.keys.right) {
      this.keyState.right = false;
      this.keyState.rightHandled = true;
      this.keyState.rightTotal = 0;
      this.keyState.autoRepeat = false;
    }

    if (event.keyCode === Settings.keys.left) {
      this.keyState.left = false;
      this.keyState.leftHandled = true;
      this.keyState.leftTotal = 0;
      this.keyState.autoRepeat = false;
    }

    if (event.keyCode === Settings.keys.cw) {
      this.keyState.cw = false;
    }

    if (event.keyCode === Settings.keys.ccw) {
      this.keyState.ccw = false;
    }

    if (event.keyCode === Settings.keys.switch) {
      this.keyState.switch = false;
    }

    if (event.keyCode === Settings.keys.hardDrop) {
      this.keyState.hardDrop = false;
    }

    if (event.keyCode === Settings.keys.softDrop) {
      this.gravityTimeout = 500;
      this.keyState.softDrop = false;
      this.keyState.softDropHandled = true;
    }
  }

  input(delta) {
    this.state.alive ? this.aliveInput(delta) : this.deadInput();
  }

  aliveInput(delta) {
    const movementDelay = this.keyState.autoRepeat ? Settings.game.arr : Settings.game.das;

    if (this.keyState.restart && !this.keyState.restartHandled) {
      this.keyState.restartHandled = true;
      this.attemptRestart();
    }

    if (this.keyState.right) {
      this.keyState.rightTotal += delta;

      if (!this.keyState.rightHandled) {
        this.keyState.rightHandled = true;
        this.moveActivePieceRight();
      }

      if (this.keyState.rightTotal > movementDelay) {
        if (!this.keyState.autoRepeat) { this.keyState.autoRepeat = true; }
        this.keyState.rightTotal = 0;
        this.moveActivePieceRight();
      }
    }

    if (this.keyState.left) {
      this.keyState.leftTotal += delta;

      if (!this.keyState.leftHandled) {
        this.keyState.leftHandled = true;
        this.moveActivePieceLeft();
      }

      if (this.keyState.leftTotal > movementDelay) {
        if (!this.keyState.autoRepeat) { this.keyState.autoRepeat = true; }
        this.keyState.leftTotal = 0;
        this.moveActivePieceLeft();
      }
    }
    if (this.keyState.cw && !this.keyState.cwHandled) {
      this.keyState.cwHandled = true;
      this.rotateActivePieceCW();
    }

    if (this.keyState.ccw && !this.keyState.ccwHandled) {
      this.keyState.ccwHandled = true;
      this.rotateActivePieceCCW();
    }

    if (this.keyState.switch && !this.keyState.switchHandled) {
      this.keyState.switchHandled = true;
      this.switchActivePieceGems();
    }

    if (this.keyState.hardDrop && !this.keyState.hardDropHandled) {
      this.keyState.hardDropHandled = true;
      this.hardDrop();
    }

    if (this.keyState.softDrop && !this.keyState.softDropHandled) {
      this.keyState.softDropHandled = true;
      this.softDrop(delta);
    }
  }

  gravity(delta) {
    this.gravityTotal += delta;
    if (this.playerBoard.isClear(offsetPositions(this.playerBoard.activePiece, [0, -1]))) {
      this.state.lockdelayTotal = 0;
      this.state.locking = false;
      this.lockdelayElement.style.width = '100%';
      if ((this.gravityTotal) > this.gravityTimeout) {
        this.recorder.addMove('gravity');
        this.gravityTotal = 0;
        this.moveActivePieceDown();
      }
    } else {
      this.lockDelay(delta);
    }
  }

  lockDelay(delta) {
    // If there is a piece below us it's time to implement lockdelay instead
    // of regular gravity, but first, we make sure the player isn't stalling
    // forever, which doesn't really matter in single player games but come
    // multiplayer would be a big issue
    this.state.lockdelayTotal += delta;

    if (this.state.lockdelayTotal >= this.lockdelayMax) { this.lock(); }

    if (!this.state.locking) {
      this.gravityTotal = delta;
      this.state.locking = true;
    }

    this.lockdelayElement.style.width = `${100 - this.gravityTotal / this.lockdelayTimeout * 100}%`;
    if (this.gravityTotal > this.lockdelayTimeout) {
      this.recorder.addMove('gravityLock');
      this.gravityTotal = 0;
      this.lock();
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

    this.playerBoard.update();
    this.spawnGarbage();

    this.recorder.addBoardData(this.playerBoard);

    if (this.playSounds) { Audio.lock.play(); }

    this.spawnNextPiece();
  }

  spawnNextPiece() {
    if (this.playerBoard.isClear(this.spawnPositions())) {
      this.playerBoard.activePiece = this.nextPiece();
    } else {
      if (this.battleState.lines === 0) {
        this.lose(this.playerBoard.stats.runningTime);
      } else {
        this.ko(this.playerBoard.stats.runningTime);
        this.spawnNextPiece();
      }
    }
  }

  ko() {
    this.battleState.lines = 0;
    this.battleState.lineQueue = 0;
    this.opponentBoard.player.battleState.kos += 1;
  }

  updateGPM() {
    this.playerBoard.stats.gpm = (
      sum(this.garbageSent) * 60 / (this.playerBoard.stats.runningTime / 1000)
    );
  }

  sendGarbage(damage) {
    const toRemove = min([damage, this.garbageQueue.length]);

    this.garbageSent.push(damage);

    damage -= toRemove;
    this.garbageQueue.length -= toRemove;

    return damage;
  }

  sendLines(lines) {
    const lineTotal = this.battleState.lineQueue + this.battleState.lines;

    if (lines <= this.battleState.lineQueue) {
      this.battleState.lineQueue -= lines;
    } else if (lines <= lineTotal) {
      this.battleState.lines = lines - this.battleState.lineQueue;
      this.battleState.lineQueue = 0;
    } else {
      const damageLines = lines - (this.battleState.lines + this.battleState.lineQueue);
      this.battleState.lines = 0;
      this.battleState.lineQueue = 0;
      this.opponentBoard.player.receiveLines(damageLines);
    }
  }

  queueGarbage(damage, dropPattern) {
    // Mod 6 this bad boy to get the column
    const colMapping = [4, 1, 5, 0, 2, 3];

    for (let i = 0; i < damage; i++) {
      const column = colMapping[i % 6];
      const colour = dropPattern[i % 24];
      this.garbageQueue.push(new Gem(undefined,
        column, this.playerBoard.height - 1,
        colour, false, 5,
      ));
      this.recorder.addMove('queueGarbage', { column: column, colour: colour });
    }
  }

  spawnGarbage() {
    if (this.garbageQueue.length === 0) { return; }

    this.recorder.addMove('spawnGarbage');

    this.garbageQueue.forEach(gem => {
      if (this.playerBoard.isClear([gem])) {
        gem.board = this.playerBoard;
        gem.gravity();
      }
    });

    this.garbageQueue = [];
  }

  receiveLines(lines) {
    this.recorder.addMove('currentLines', { lines: lines });
    this.battleState.lineQueue += lines;
  }

  tick(delta) {
    this.input(delta);

    if (!this.state.alive) { return; }

    this.playerBoard.stats.runningTime += delta;
    this.recorder.currentTime = this.playerBoard.stats.runningTime;

    this.updateInterface();

    this.modeTick(delta);
    this.gravity(delta);
  }

  updateInterface() {
    this.timeValue.innerText = displayMilliseconds(this.playerBoard.stats.runningTime);
  }

  modeTick(delta) {
    throw 'modeTick must be overloaded in child class';
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
    this.recorder.addMove('lose');
    this.state.alive = false;
    this.playerBoard.overlay = m.trust(`
      Oh no, you topped out!</br>
      Press
      ${Settings.site.displayMobileControls ?
          '<span class="icon-restart"></span>' : keyboardMap[Settings.keys.restart]}
      to restart.
    `);
    m.redraw();
    if (this.playSounds) { Audio.lose.play(); }
  }

  win() {
    if (this.playSounds) { Audio.win.play(); }
  }

  persist(mode, result) {
    if (result === undefined) { result = 0; }
    this.recorder.persist(
      mode,
      this.playerBoard.stats.runningTime,
      this.playerBoard.stats.score,
      this.playerBoard.stats.gpm,
      result
    ).then(response => {
      this.lastReplay = response.data;
      Flash.addFlash({
        text: 'Replay saved',
        href: response.data.link,
        timeout: 5000,
      });
    });
  }
}
