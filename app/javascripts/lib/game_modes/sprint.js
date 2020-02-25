import m from 'mithril';

import Player from '../player';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import { timestamp, displayMilliseconds, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Sprint extends Player {
  setup() {
    this.recorder = new ReplayRecorder('sprint');
    this.playerBoard.stats.start = timestamp();
  }

  tick(delta) {
    this.playerBoard.stats.runningTime += delta;
    this.recorder.currentTime = this.playerBoard.stats.runningTime;
    this.input(delta);

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
    this.recorder.persist(0, this.playerBoard.stats.runningTime, this.playerBoard.stats.score).then(response => {
      this.lastReplay = response.data;
    });

    this.state.alive = false;
    let newBest = false;
    if (CurrentUser.isPresent()) {
      const oldBest = CurrentUser.data.bests.sprint;
      newBest = oldBest ? (this.playerBoard.stats.runningTime < oldBest.time) : false;
      if (newBest) { CurrentUser.refresh(); }
    }

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You took ${displayMilliseconds(this.playerBoard.stats.runningTime)}!
      ${ newBest ? `You improved your best by ${displayMilliseconds(oldBest.time - this.playerBoard.stats.runningTime)}` : ''}
    `);
    m.redraw();
  }
}
