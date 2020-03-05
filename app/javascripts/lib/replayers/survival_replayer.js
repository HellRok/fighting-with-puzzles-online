import m from 'mithril';

import BaseReplayer from './base_replayer';
import { displayMilliseconds } from '../helpers';

export default class SurvivalReplayer extends BaseReplayer {
  lose(time) {
    super.win(time);
    this.state.alive = false;
    // Again this is a matter of the actual elapsed time not exactly matching
    // the time recorded
    this.playerBoard.stats.runningTime = time;
    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      They survived ${displayMilliseconds(time)}!
    `);
    m.redraw();
  }
}
