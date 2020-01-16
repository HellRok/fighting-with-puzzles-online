import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import SettingsForm from './_settings_form';
import main from '../lib/main'

export default class Home {
  constructor() {
    self.board = new Board();
  }

  startGame() {
    main([self.board]);
  }

  view() {
    return m(Layout, [
      m('h1', 'HI THERE!'),
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

