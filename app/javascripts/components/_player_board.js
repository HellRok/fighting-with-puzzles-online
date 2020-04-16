import m from 'mithril';

import Board from './_board';

export default class PlayerBoard extends Board {
  view(vnode) {
    return [
      m('.player-board', [
        super.view(vnode),
        m('.stats', [
          'hi'
        ]),
      ])
    ];
  }
}
