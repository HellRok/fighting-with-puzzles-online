import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings';
import Sprint from '../lib/game_modes/sprint';
import { displayMilliseconds, keyboardMap } from '../lib/helpers';

import CurrentUser from '../lib/current_user';

export default class SprintPresenter {
  constructor() {
    this.playerBoard = new Board();
  }

  oncreate() {
    this.player = new Sprint(this.playerBoard);
    this.player.gameLoop();
    this.player.renderLoop();
    if (Settings.site.displayMobileControls) {
      this.playerBoard.overlay = m.trust(`Press <span class="icon-restart"></span> to start.`);
    } else {
      this.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to start.`;
    }
  }

  onremove() {
    this.player.destroy();
  }

  view() {
    return m(Layout, m('.sprint.single-player', [
      m('h2', 'Sprint'),

      m('p.personal-best',
        CurrentUser.isPresent() ?
          CurrentUser.data.bests.sprint ?
          [
            m('div', `Personal Best: ${displayMilliseconds(CurrentUser.data.bests.sprint.time)}`),
            m(m.route.Link, { href: `/sprint/replay/${CurrentUser.data.bests.sprint.id}`, class: 'best-replay' }, 'Replay'),
          ] :
          m('p', "You haven't played this mode yet! Play a game to get a best time.") :
        m('p', "You must be logged in to have a best time.")
      ),

      m(this.playerBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(this.playerBoard.stats.runningTime))),
        m('.gems-left', `Gems: ${140 - this.playerBoard.stats.gemsSmashed}`),

        ((this.player && this.player.lastReplay) ? m(m.route.Link, {
          href: `/sprint/replay/${this.player.lastReplay.id}`,
        }, m('.last-replay', 'Last Replay')) : ''),
      ]),
    ]));
  }
};
