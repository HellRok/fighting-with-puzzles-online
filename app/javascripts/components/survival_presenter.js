import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings';
import Survival from '../lib/game_modes/survival';
import { displayMilliseconds, displayScore, keyboardMap } from '../lib/helpers';

import CurrentUser from '../lib/current_user';

export default class SurvivalPresenter {
  constructor() {
    this.playerBoard = new Board();
  }

  oncreate() {
    this.player = new Survival(this.playerBoard);
    this.player.gameLoop();
    this.player.renderLoop();
    this.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to start.`;
  }

  onremove() {
    this.player.destroy();
  }

  view() {
    return m(Layout, m('.survival.single-player', [
      m('h2', 'Survival'),

      m('p.personal-best',
        CurrentUser.isPresent() ?
          CurrentUser.data.bests.survival ?
          [
            m('div', `Personal Best: ${displayMilliseconds(CurrentUser.data.bests.survival.time)}`),
            m(m.route.Link, { href: `/survival/replay/${CurrentUser.data.bests.survival.id}`, class: 'best-replay' }, 'Replay'),
          ] :
          m('p', "You haven't played this mode yet! Play a game to get a best time.") :
        m('p', "You must be logged in to have a best time.")
      ),

      m(this.playerBoard),
      m('.stats', [
        m('.next-dump', '2 garbage in 00:05.000'),
        m('.time', 'Time: ', m('span.value', displayMilliseconds(this.playerBoard.stats.runningTime))),
        m('.score', `Score: ${displayScore(this.playerBoard.stats.score)}`),

        ((this.player && this.player.lastReplay) ? m(m.route.Link, {
          href: `/survival/replay/${this.player.lastReplay.id}`,
        }, m('.last-replay', 'Last Replay')) : ''),
      ]),
    ]));
  }
};
