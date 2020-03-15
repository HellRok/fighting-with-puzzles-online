import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings';
import Ultra from '../lib/game_modes/ultra';
import { displayMilliseconds, displayScore, keyboardMap } from '../lib/helpers';

import CurrentUser from '../lib/current_user';

export default class UltraPresenter {
  constructor() {
    this.playerBoard = new Board();

  }

  oncreate() {
    this.player = new Ultra(this.playerBoard);
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
    return m(Layout, m('.ultra.single-player', [
      m('h2', 'Ultra'),

      m('p.personal-best',
        CurrentUser.isPresent() ?
          CurrentUser.data.bests.ultra ?
          [
            m('div', [
              'Personal Best:',
              m(
                m.route.Link,
                { href: `/ultra/replay/${CurrentUser.data.bests.ultra.id}`, class: 'best-replay' },
                displayScore(CurrentUser.data.bests.ultra.score),
              )
            ])
          ] :
          m('p', "You haven't played this mode yet! Play a game to get a best score.") :
        m('p', "You must be logged in to have a best score.")
      ),

      m(this.playerBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(0))),
        m('.score', `Score: ${displayScore(this.playerBoard.stats.score)}`),

        ((this.player && this.player.lastReplay) ? m(m.route.Link, {
          href: `/ultra/replay/${this.player.lastReplay.id}`,
        }, 'Last Replay') : ''),
      ]),
    ]));
  }
};
