import m from 'mithril';

import BattleStateBase from './base';
import BattleStatePlaying from './playing';
import BattleOpponent from '../../battle_opponent';

import CurrentUser from '../../current_user';
import Settings from '../../settings';
import Api from '../../api';

export default class BattleStateConnecting extends BattleStateBase {
  setup() {
    this.game.playerBoard.clear();
    this.game.opponentBoard.clear();
    this.game.playerBoard.overlay = 'Loading...';
    this.game.opponentBoard.overlay = 'Loading...';
    m.redraw();
    this.load();
  }

  teardown() {
    this.game.playerBoard.overlay = null;
    this.game.opponentBoard.overlay = null;
    m.redraw();
  }

  load() {
    Api.replaysFindBattle().then(replay => {
      this.game.opponentBoard.player = new BattleOpponent(this.game.opponentBoard);
      this.game.opponentBoard.player.loadReplay(replay);
      this.game.opponentBoard.player.opponentBoard = this.game.playerBoard;
      this.game.changeState(BattleStatePlaying);
    });
  }
}
