import m from 'mithril';
import Layout from './layout';
import Board from './_board';

export default class Home {
  constructor() {
  }

  view() {
    return m(Layout, [
      m('h1', 'HI THERE!'),
      m(Board)
    ]);
  }
};

