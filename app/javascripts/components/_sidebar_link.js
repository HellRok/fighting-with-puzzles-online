import m from 'mithril';

import Nav from './nav';
import { isBigScreen } from '../lib/helpers';

export default class SidebarLink {
  oninit(vnode) {
    this.href = vnode.attrs.href;
  }

  view(vnode) {
    return m(m.route.Link,
            {
              class: 'sidebar-link',
              href: this.href,
              onclick: function(e) { if (!isBigScreen()) { Nav.toggle(); } }
            }, vnode.children);
  }
};

