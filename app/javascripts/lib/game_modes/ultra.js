import m from 'mithril';

import Player from '../player';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import { timestamp, displayMilliseconds, displayScore, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Ultra extends Player {
  setup() {
    this.recorder = new ReplayRecorder('ultra', this.seed);
    this.ultraTime = 180000; // 3 minutes
  }

  modeTick(delta) {
    if (this.playerBoard.stats.runningTime >= this.ultraTime) { this.win(); }
  }

  updateInterface() {
    this.timeValue.innerText = displayMilliseconds(this.ultraTime - this.playerBoard.stats.runningTime);
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
    this.persist(1, 1);
  }

  win(time) {
    super.win(time);
    this.recorder.addMove('win');
    this.state.alive = false;
    this.updateGPM();

    let newBest = false;
    let oldBest;

    if (CurrentUser.isPresent()) {
      oldBest = CurrentUser.data.bests.ultra;
      if (oldBest) {
        newBest = this.playerBoard.stats.score - oldBest.score
      } else {
        newBest = true;
      }
      CurrentUser.refresh();
    }

    this.persist(1, 0);

    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.playerBoard.stats.runningTime = this.ultraTime;

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      Your score was ${displayScore(this.playerBoard.stats.score)}!
      ${ newBest > 0 && oldBest ? `You improved your best by ${displayScore(this.playerBoard.stats.score - oldBest.score)}` : ''}
    `);
    m.redraw();
  }
}
