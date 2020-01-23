import m from 'mithril';

export default class SidebarLink {
  constructor() {
  }

  oninit(vnode) {
    this.href = vnode.attrs.href;
    this.sidebar = vnode.attrs.sidebar;
  }

  view(vnode) {
    const _this = this;
    return m(m.route.Link,
            {
              class: 'sidebar-link',
              href: this.href,
              onclick: function(e) { _this.sidebar.toggle(); }
            }, vnode.children);
  }
};

