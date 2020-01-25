import m from 'mithril';

import Layout from './layout';

export default class Home {
  view() {
    return m(Layout, [
      m('h2', 'Home'),
    ]);
  }
};
