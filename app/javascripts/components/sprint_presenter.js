import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import SettingsForm from './_settings_form';
import Sprint from '../lib/game_modes/sprint'

export default class SprintPresenter {
  constructor() {
    this.playerBoard = new Board();
    this.player = new Sprint(this.playerBoard);

  }

  oncreate() {
    this.player.gameLoop();
    this.player.renderLoop();
  }

  view() {
    return m(Layout, [
      m('h2', 'Sprint'),
      m(this.playerBoard),
      m(SettingsForm),
    ]);
  }
};
