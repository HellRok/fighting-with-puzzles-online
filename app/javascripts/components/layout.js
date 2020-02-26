import m from 'mithril';

import Settings from '../lib/settings';

export default class Layout {
  oninit() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'UA-157003509-1', { 'page_path': m.route.get() });
    };
  }

  view(vnode) {
    return [
      m('.content', [
        (Settings.site.beenHereBefore ? '' : m(m.route.Link,
          {
            href: '/how_to_play',
            class: 'show-how-to-play',
          },
          [
            m('.text', `It looks like it's your first time here, click here to see how to play.`),
          ]
        )),
        ...vnode.children,
      ])
    ];
  }
};
