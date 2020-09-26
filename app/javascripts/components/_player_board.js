import m from 'mithril';

import Board from './_board';
import PlayerLink from './_player_link';
import CurrentUser from '../lib/current_user';

export default class PlayerBoard extends Board {
  view(vnode) {
    return [
      m('.player-board', [
        super.view(vnode),
        m('.stats', [
          m(PlayerLink, { user: CurrentUser.data, state: this.game?.state }),
          m('.gpm', { title: 'Garbage per minute' }, `GPM: ${this.stats.gpm.toFixed(2)}`),
        ]),
      ])
    ];
  }
}
