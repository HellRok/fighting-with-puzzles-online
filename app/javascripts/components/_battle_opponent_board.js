import m from 'mithril';

import Board from './_board';
import PlayerLink from './_player_link';

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
          m(PlayerLink, { user: this.player.user, state: this.game?.state }),
          m('.gpm', { title: 'Garbage per minute' }, `GPM: ${this.stats.gpm.toFixed(2)}`),
          m('.kos', { title: 'KOs' }, `KOs: ${this.game && this.game.battleState.kos || 0}`),
        ]),
      ])
    ];
  }
}
