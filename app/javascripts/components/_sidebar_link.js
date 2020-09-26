import m from 'mithril';

import Nav from './nav';
import { isBigScreen } from '../lib/helpers';

export default class SidebarLink {
  view(vnode) {
    return m(m.route.Link,
            {
              class: 'sidebar-link',
              href: vnode.attrs.href,
              onclick: function(e) { if (!isBigScreen()) { Nav.toggle(); } }
            }, vnode.children);
  }
};
