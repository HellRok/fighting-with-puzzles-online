import m from 'mithril';

import Player from '../player';
import Settings from '../settings';
import { timestamp, keyboardMap } from '../helpers';

export default class Sprint extends Player {
  setup() {
    this.playerBoard.stats.start = timestamp();
  }

  tick(delta) {
    this.input();

    if (!this.state.alive) { return; }

    this.gravity();

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
    this.state.alive = false;
    this.playerBoard.overlay = m.trust(`
      Oh no, you topped out!</br>
      Press ${keyboardMap[Settings.keys.restart]} to restart.
    `);
    m.redraw();
  };

  win() {
    const end = timestamp();
    this.state.alive = false;
    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You took ${(end - this.playerBoard.stats.start) / 1000} seconds!
    `);
    m.redraw();
  }
}
