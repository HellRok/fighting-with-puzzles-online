import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import Ultra from '../lib/game_modes/ultra'
import { displayMilliseconds, keyboardMap } from '../lib/helpers';

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

  bestUltraScore() {
    return localStorage.getItem('bestUltraScore');
  }
  view() {
    return m(Layout, [
      m('h2', 'Ultra'),
      m('p', 'Score as high as you can in 3 minutes.'),
      m('p', this.bestUltraScore() ? `Personal Best: ${this.bestUltraScore()}` : "You haven't played this mode yet! Play a game to get a best time"),
      m(this.playerBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(0))),
        m('.score', `Score: ${this.playerBoard.stats.score}`),
      ]),
    ]);
  }
};
