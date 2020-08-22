import m from 'mithril';

import Layout from './layout';
import { displayMilliseconds, displayScore } from '../lib/helpers';

import CurrentUser from '../lib/current_user';

export default class Home {
  view() {
    return m(Layout, [
      m('.home-links-container.max-width-960', [
        m('h2', 'Game Modes'),

        m(m.route.Link, {
          class: 'home-link',
          href: '/online',
        }, [
          m('h3', 'Online (Alpha)'),
          m('p', 'Play against others in real time.'),
        ]),

        m(m.route.Link, {
          class: 'home-link',
          href: '/battle',
        }, [
          m('h3', 'Battle'),
          m('p', '1v1 to get the most KOs in 2 minutes.'),
        ]),

        m(m.route.Link, {
          class: 'home-link',
          href: '/sprint',
        }, [
          m('h3', 'Sprint'),
          m('p', 'Clear 140 gems as fast as possible.'),
          CurrentUser.isPresent() ?
            m('p', CurrentUser.data.bests.sprint ?
              `Personal Best: ${displayMilliseconds(CurrentUser.data.bests.sprint.time)}` :
              "You haven't beat this mode yet!"
            ) : '',
        ]),

        m(m.route.Link, {
          class: 'home-link',
          href: '/ultra',
        }, [
          m('h3', 'Ultra'),
          m('p', 'Score as high as you can in 3 minutes.'),
          CurrentUser.isPresent() ?
            m('p', CurrentUser.data.bests.ultra ?
              `Personal Best: ${displayScore(CurrentUser.data.bests.ultra.score)}` :
              "You haven't beat this mode yet!"
            ) : '',
        ]),

        m(m.route.Link, {
          class: 'home-link',
          href: '/survival',
        }, [
          m('h3', 'Survival'),
          m('p', 'Survive as long as you can against an onslaught of attacks.'),
          CurrentUser.isPresent() ?
            m('p', CurrentUser.data.bests.survival ?
              `Personal Best: ${displayMilliseconds(CurrentUser.data.bests.survival.time)}` :
              "You haven't played this mode yet!"
            ) : '',
        ]),
      ]),
    ]);
  }
};
