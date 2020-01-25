import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import SettingsForm from './_settings_form';

export default class Home {
  constructor() {
    self.board = new Board();
  }

  view() {
    return m(Layout, [
      m('h2', 'Home'),
      m(self.board),
      m(SettingsForm),
    ]);
  }
};
