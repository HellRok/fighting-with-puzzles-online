import m from 'mithril';

import Layout from './layout';
import BattleBoard from './_battle_board';
import BattleOpponentBoard from './_battle_opponent_board';
import Settings from '../lib/settings';
import Battle from '../lib/game_modes/battle';
import { displayMilliseconds, displayScore, keyboardMap } from '../lib/helpers';

import CurrentUser from '../lib/current_user';

export default class BattlePresenter {
  constructor() {
    this.playerBoard = new BattleBoard();
    this.opponentBoard = new BattleOpponentBoard({ uuid: 'opponent-board' });
  }

  oncreate(vnode) {
    this.player = new Battle(this.playerBoard, vnode.attrs.seed);
    this.player.opponentBoard = this.opponentBoard;
    this.player.gameLoop();
    this.player.renderLoop();
  }

  onremove() {
    this.player.destroy();
  }

  view() {
    return m(Layout,[
      m('h2.text-centre', 'Battle'),
      m('.time.text-centre', 'Time: ', m('span.value', displayMilliseconds(this.player?.battleTime || 0 ))),
      m('.battle', [
        m(this.playerBoard),
        m(this.opponentBoard),
      ])
    ]);
  }
};
