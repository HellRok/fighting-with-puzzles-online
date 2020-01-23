import m from 'mithril';

import SidebarLink from './_sidebar_link';

export default class Nav {
  constructor() {
    this.showSidebar = window.innerWidth > 1024;
  }

  toggle() {
    this.showSidebar = !this.showSidebar;
  }

  view() {
    const _this = this;
    return [
      m('nav', [
        m('.content', [
          m(m.route.Link,
            {
              href: '/',
              class: 'logo'
            }, 'Fighting with Puzzles Online'),
          m('.toggle-sidebar',
            {
              class: this.showSidebar ? 'icon-cancel' : 'icon-menu',
              onclick: () => _this.toggle(),
            }
          )
        ])
      ]),
      m('.sidebar', {
          class: (this.showSidebar ? 'shown' : 'hidden'),
        }, [
          m(SidebarLink, {
            href: '/', sidebar: this,
          }, 'Home'),
          m(SidebarLink, {
            href: '/sprint', sidebar: this,
          }, 'Sprint'),
          m(SidebarLink, {
            href: '/ultra', sidebar: this,
          }, 'Ultra'),
      ]),
    ];
  }
};
