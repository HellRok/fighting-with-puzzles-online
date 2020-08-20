import m from 'mithril';

import Board from './_board';

import { displayMilliseconds }  from '../lib/helpers';

export default class BattleOpponentBoard extends Board {
  constructor(player) {
    super(player.uuid);
    this.player = player;
  }

  damage() {
    return this.game.battleState.lineQueue;
  }

  view(vnode) {
    return [
      m('.opponent-board', [
        super.view(vnode),
        m('.stats', [
          (this.player.id ?
            m(m.route.Link, { href: `/profile/${this.player.id}` }, this.player.username) :
            'Anon'),
          m('.gpm', { title: 'Garbage per minute' }, `GPM: ${this.stats.gpm.toFixed(2)}`),
          m('.kos', { title: 'KOs' }, `KOs: ${this.game && this.game.battleState.kos || 0}`),
        ]),
      ])
    ];
  }
}
