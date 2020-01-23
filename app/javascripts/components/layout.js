import m from 'mithril';

export default class Layout {
  view(vnode) {
    return [
      m('.content', vnode.children)
    ];
  }
};
