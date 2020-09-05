import m from 'mithril';

import Player from '../player';
import ReplayRecorder from '../replay_recorder';
import SprintPieceGenerator from '../piece_generators/sprint_piece_generator';
import Settings from '../settings';
import { timestamp, displayMilliseconds, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Sprint extends Player {
  setup() {
    this.recorder = new ReplayRecorder('sprint', this.seed);
  }

  setupPieceGenerator() {
    this.pieceGenerator = new SprintPieceGenerator(this.queueLength, (this.seed ? this.seed : Date.now()));
    this.pieceGenerator.queue.forEach(gems => this.recorder.addPiece(gems));
  }

  tick(delta) {
    this.input(delta);

    if (!this.state.alive) { return; }

    this.playerBoard.stats.runningTime += delta;
    this.recorder.currentTime = this.playerBoard.stats.runningTime;

    this.timeValue.innerText = displayMilliseconds(this.playerBoard.stats.runningTime);

    this.gravity(delta);

    if (this.playerBoard.stats.gemsSmashed >= 140) { this.win(); }
  }

  deadInput() {
    if (this.keyState.restart) {
      this.restart();
    }
  }

  attemptRestart() {
    this.restart();
  }

  lose(time) {
    super.lose(time);
    this.persist(0, 1);
  }

  win(time) {
    this.updateGPM();
    this.recorder.addMove('win');
    this.state.alive = false;
    super.win(time);

    let newBest = false;
    let oldBest;

    if (CurrentUser.isPresent()) {
      oldBest = CurrentUser.data.bests.sprint;
      if (oldBest) {
        newBest = oldBest.time - this.playerBoard.stats.runningTime;
      } else {
        newBest = true;
      }
    }

    this.persist(0, 0);

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You took ${displayMilliseconds(this.playerBoard.stats.runningTime)}!
      ${ newBest > 0 && oldBest ? `You improved your best by ${displayMilliseconds(newBest)}` : ''}
    `);
    m.redraw();
  }
}
