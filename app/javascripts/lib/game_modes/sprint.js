import m from 'mithril';

import Player from '../player';
import { timestamp } from '../helpers';

export default class Sprint extends Player {
  setup() {
    this.board.stats.start = timestamp();
  }

  tick(delta) {
    if (!this.state.alive) { return; }

    this.input();
    this.gravity();

    if (this.board.stats.gemsSmashed >= 140) { this.win(); }
  }

  lose() {
    this.state.alive = false;
    this.board.overlay = 'You topped out!';
    m.redraw();
  };

  win() {
    const end = timestamp();
    this.state.alive = false;
    this.board.overlay = m.trust(`
      <h3>Finished</h3>
      You took ${(end - this.board.stats.start) / 1000} seconds!
    `);
    m.redraw();
  }
}
