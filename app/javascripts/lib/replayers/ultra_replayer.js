import m from 'mithril';

import BaseReplayer from './base_replayer';
import { displayMilliseconds, displayScore } from '../helpers';

export default class UltraReplayer extends BaseReplayer {
  win(time) {
    this.state.alive = false;
    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.playerBoard.stats.runningTime = this.ultraTime;

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      Their score was ${displayScore(this.playerBoard.stats.score)}!
    `);
    m.redraw();
  }

  lose(time) {
    this.playerBoard.overlay = m.trust(`
      Oh no, they topped out!
    `);
    m.redraw();
  };
}

