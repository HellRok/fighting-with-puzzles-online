import m from 'mithril';

import Player from '../player';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import Flash from '../flash';
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
    this.input(delta);

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

  lose(time) {
    super.lose(time);
    this.recorder.addMove('lose');
    this.state.alive = false;
    this.playerBoard.overlay = m.trust(`
      Oh no, you topped out!</br>
      Press ${keyboardMap[Settings.keys.restart]} to restart.
    `);
    m.redraw();
  };

  win(time) {
    super.win(time);
    this.recorder.addMove('win');

    this.state.alive = false;
    let newBest = false;
    let oldBest;

    if (CurrentUser.isPresent()) {
      oldBest = CurrentUser.data.bests.ultra;
      if (oldBest) {
        newBest = this.playerBoard.stats.score - oldBest.score
      } else {
        newBest = true;
      }
    }

    this.recorder.persist(1, this.playerBoard.stats.runningTime, this.playerBoard.stats.score).then(response => {
      if (newBest) { CurrentUser.refresh(); }
      this.lastReplay = response.data;
      Flash.addFlash({
        text: 'Replay saved',
        href: `/ultra/replay/${this.lastReplay.id}`,
        timeout: 5000,
      });
    });

    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.playerBoard.stats.runningTime = this.ultraTime;

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      Your score was ${displayScore(this.playerBoard.stats.score)}!
      ${ newBest && oldBest ? `You improved your best by ${displayScore(this.playerBoard.stats.score - oldBest.score)}` : ''}
    `);
    m.redraw();
  }
}
