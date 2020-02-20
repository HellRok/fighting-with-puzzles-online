import m from 'mithril';

export default class Layout {
  oninit() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'UA-157003509-1', { 'page_path': m.route.get() });
    };
  }

  view(vnode) {
    return [
      m('.content', vnode.children)
    ];
  }
};
