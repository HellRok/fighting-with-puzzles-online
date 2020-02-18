import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import Ultra from '../lib/game_modes/ultra'
import { displayMilliseconds, displayScore, keyboardMap, bests } from '../lib/helpers';

export default class UltraPresenter {
  constructor() {
    this.playerBoard = new Board();

  }

  oncreate() {
    this.player = new Ultra(this.playerBoard);
    this.player.gameLoop();
    this.player.renderLoop();
    this.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to start.`;
  }

  onremove() {
    this.player.destroy();
  }

  bestScore() {
    return bests().ultraScore;
  }

  bestReplay() {
    return bests().ultraReplay;
  }

  view() {
    return m(Layout, m('.ultra.single-player', [
      m('h2', 'Ultra'),
      m('p', 'Score as high as you can in 3 minutes.'),
      m('p', [
        m('.personal-best',
          this.bestScore() ?
          `Personal Best: ${displayScore(this.bestScore())}` :
          "You haven't played this mode yet! Play a game to get a best score."),
        (this.bestReplay() ? m(m.route.Link, {
          href: `/ultra/replay?replayData=${this.bestReplay()}`,
        }, m('.best-replay', 'Replay')) : ''),
      ]),
      m(this.playerBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(0))),
        m('.score', `Score: ${displayScore(this.playerBoard.stats.score)}`),
      ]),
      ((this.player && this.player.lastReplay) ? m(m.route.Link, {
        href: `/ultra/replay?replayData=${this.player.lastReplay}`,
      }, 'Last Replay') : ''),
    ]));
  }
};
