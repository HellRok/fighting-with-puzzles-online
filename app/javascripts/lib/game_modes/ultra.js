import m from 'mithril';

import Player from '../player';
import Settings from '../settings';
import { timestamp, displayMilliseconds, displayScore, keyboardMap } from '../helpers';

export default class Ultra extends Player {
  setup() {
    this.playerBoard.stats.start = timestamp();
    this.ultraTime = 180000; // 3 minutes
  }

  tick(delta) {
    this.input();

    if (!this.state.alive) { return; }

    this.timeValue.innerText = displayMilliseconds(this.ultraTime - this.playerBoard.stats.runningTime);

    this.gravity(delta);
    this.playerBoard.stats.runningTime += delta;

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
    this.state.alive = false;
    this.playerBoard.overlay = m.trust(`
      Oh no, you topped out!</br>
      Press ${keyboardMap[Settings.keys.restart]} to restart.
    `);
    m.redraw();
  };

  win() {
    this.state.alive = false;
    const oldBest = localStorage.getItem('bestUltraScore');
    const newBest = oldBest ? (this.playerBoard.stats.score > oldBest) : false;

    if (newBest || !oldBest) {
      localStorage.setItem('bestUltraScore', this.playerBoard.stats.score);
    }

    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.playerBoard.stats.runningTime = this.ultraTime;

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      Your score was ${displayScore(this.playerBoard.stats.score)}!
      ${ newBest ? `You improved your best by ${displayScore(this.playerBoard.stats.score - oldBest)}` : ''}
    `);
    m.redraw();
  }
}
