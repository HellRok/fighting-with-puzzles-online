import m from 'mithril';

import Board from './_board';
import CurrentUser from '../lib/current_user';

export default class PlayerBoard extends Board {
  view(vnode) {
    return [
      m('.player-board', [
        super.view(vnode),
        m('.stats', [
          (CurrentUser.data.id ?
            m(m.route.Link, { href: `/profile/${CurrentUser.data.id}` }, CurrentUser.data.username) :
            'Anon'),
          m('.gpm', { title: 'Garbage per minute' }, `GPM: ${this.stats.gpm.toFixed(2)}`),
        ]),
      ])
    ];
  }
}
