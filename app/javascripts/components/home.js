import m from 'mithril';
import Layout from './layout';

export default class Home {
  constructor() {
  }

  view() {
    return m(Layout, [
      m('h1', 'HI THERE!')
    ]);
  }
};

