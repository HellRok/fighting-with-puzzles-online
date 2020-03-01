import m from 'mithril';

import Player from '../player';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import Flash from '../flash';
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
      oldBest = CurrentUser.data.bests.sprint;
      if (oldBest) {
        newBest = oldBest.time - this.playerBoard.stats.runningTime;
      } else {
        newBest = true;
      }
    }

    this.recorder.persist(0, this.playerBoard.stats.runningTime, this.playerBoard.stats.score).then(response => {
      if (newBest) { CurrentUser.refresh(); }
      this.lastReplay = response.data;
      Flash.addFlash({
        text: 'Replay saved',
        href: `/sprint/replay/${this.lastReplay.id}`,
        timeout: 5000,
      });
    });

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You took ${displayMilliseconds(this.playerBoard.stats.runningTime)}!
      ${ newBest > 0 && oldBest ? `You improved your best by ${displayMilliseconds(newBest)}` : ''}
    `);
    m.redraw();
  }
}
