import m from 'mithril';

import Player from '../player';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import { timestamp, displayMilliseconds, keyboardMap } from '../helpers';

export default class Sprint extends Player {
  setup() {
    this.recorder = new ReplayRecorder('sprint');
    this.playerBoard.stats.start = timestamp();
  }

  tick(delta) {
    this.playerBoard.stats.runningTime += delta;
    this.recorder.currentTime = this.playerBoard.stats.runningTime;
    this.input();

    if (!this.state.alive) { return; }

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

  lose() {
    this.recorder.addMove('lose');
    this.state.alive = false;
    this.playerBoard.overlay = m.trust(`
      Oh no, you topped out!</br>
      Press ${keyboardMap[Settings.keys.restart]} to restart.
    `);
    m.redraw();
  };

  win() {
    this.recorder.addMove('win');
    this.state.alive = false;
    const oldBest = localStorage.getItem('bestSprint');
    const newBest = oldBest ? (this.playerBoard.stats.runningTime < oldBest) : false;

    if (newBest || !oldBest) {
      localStorage.setItem('bestSprint', this.playerBoard.stats.runningTime);
      localStorage.setItem('bestSprintReplay', this.recorder.toString());
    }

    this.lastReplay = this.recorder.toString();

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You took ${displayMilliseconds(this.playerBoard.stats.runningTime)}!
      ${ newBest ? `You improved your best by ${displayMilliseconds(oldBest - this.playerBoard.stats.runningTime)}` : ''}
    `);
    m.redraw();
  }
}
