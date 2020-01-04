import m from 'mithril';

export default class Layout {
  view(vnode) {
    return [
      m('nav', [
        m('.content', [
          m(m.route.Link,
            {
              href: '/',
              class: 'logo'
            }, 'Fighting with Puzzles Online')
        ])
      ]),
      m('.content', vnode.children)
    ];
  }
};
