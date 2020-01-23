import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import SettingsForm from './_settings_form';
import main from '../lib/main'

export default class Ultra {
  constructor() {
    self.board = new Board();
  }

  startGame() {
    main([self.board]);
  }

  view() {
    return m(Layout, [
      m('h2', 'Ultra'),
      m('p', 'Not yet implemented!'),
    ]);
  }
};



