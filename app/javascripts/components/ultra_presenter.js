import m from 'mithril';

import Layout from './layout';

export default class UltraPresenter {
  view() {
    return m(Layout, [
      m('h2', 'Ultra'),
      m('p', 'Not yet implemented!'),
    ]);
  }
};
