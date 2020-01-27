import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import Sprint from '../lib/game_modes/sprint'
import { displayMilliseconds, keyboardMap } from '../lib/helpers';

export default class SprintPresenter {
  constructor() {
    this.playerBoard = new Board();

  }

  oncreate() {
    this.player = new Sprint(this.playerBoard);
    this.player.gameLoop();
    this.player.renderLoop();
    this.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to start.`;
  }

  onremove() {
    this.player.destroy();
  }

  bestTime() {
    return localStorage.getItem('bestSprint');
  }

  view() {
    return m(Layout, m('.sprint', [
      m('h2', 'Sprint'),
      m('p', 'Clear 140 gems as quickly as possible.'),
      m('p', this.bestTime() ? `Personal Best: ${displayMilliseconds(this.bestTime())}` : "You haven't played this mode yet! Play a game to get a best time"),
      m(this.playerBoard),
    ]));
  }
};
