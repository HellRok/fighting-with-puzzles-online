import m from 'mithril';

import Layout from './layout';
import { displayMilliseconds, displayScore, bests } from '../lib/helpers';

export default class Home {
  view() {
    return m(Layout, [
      m('.home-links-container', [
        m('h2', 'Game Modes'),
        m(m.route.Link, {
          class: 'home-link',
          href: '/sprint',
        }, [
          m('h3', 'Sprint'),
          m('p', 'Clear 140 gems as fast as possible.'),
          m('p', bests().sprintTime ? `Personal Best: ${displayMilliseconds(bests().sprintTime)}` : "You haven't beat this mode yet!"),
        ]),

        m(m.route.Link, {
          class: 'home-link',
          href: '/ultra',
        }, [
          m('h3', 'Ultra'),
          m('p', 'Score as high as you can in 3 minutes.'),
          m('p', bests().ultraScore ? `Personal Best: ${displayScore(bests().ultraScore)}` : "You haven't beat this mode yet!"),
        ]),
      ]),
    ]);
  }
};
