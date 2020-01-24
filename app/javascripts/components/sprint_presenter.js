import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import SettingsForm from './_settings_form';
import main from '../lib/main'

export default class SprintPresenter {
  constructor() {
    self.board = new Board();
  }

  startGame() {
    main([self.board]);
  }

  onremove() {
    console.log("LOLOLO");
  }

  view() {
    return m(Layout, [
      m('h2', 'Sprint'),
      m('div', [
        m('button', {
          onclick: this.startGame
        }, 'Start'),
      ]),
      m(self.board),
      m(SettingsForm),
    ]);
  }
};
