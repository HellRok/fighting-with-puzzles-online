import m from 'mithril';

import Player from '../player';
import Settings from '../settings';
import ReplayRecorder from '../replay_recorder';
import { timestamp, displayMilliseconds, displayScore, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Ultra extends Player {
  setup() {
    this.recorder = new ReplayRecorder('ultra');
    this.playerBoard.stats.start = timestamp();
    this.ultraTime = 180000; // 3 minutes
  }

  tick(delta) {
    this.playerBoard.stats.runningTime += delta;
    this.recorder.currentTime = this.playerBoard.stats.runningTime;
    this.input();

    if (!this.state.alive) { return; }

    this.timeValue.innerText = displayMilliseconds(this.ultraTime - this.playerBoard.stats.runningTime);

    this.gravity(delta);

    if (this.playerBoard.stats.runningTime >= this.ultraTime) { this.win(); }
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
    const oldBest = CurrentUser.data.bests.ultra;
    const newBest = oldBest ? (this.playerBoard.stats.score > oldBest.score) : false;

    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.playerBoard.stats.runningTime = this.ultraTime;

    this.lastReplay = this.recorder.toString();
    this.recorder.persist(1, this.playerBoard.stats.runningTime, this.playerBoard.stats.score);

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      Your score was ${displayScore(this.playerBoard.stats.score)}!
      ${ newBest ? `You improved your best by ${displayScore(this.playerBoard.stats.score - oldBest.score)}` : ''}
    `);
    m.redraw();
  }
}
