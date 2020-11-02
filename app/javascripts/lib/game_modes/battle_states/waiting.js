import m from 'mithril';

import BattleStateBase from './base';
import BattleStateLoading from './loading';

import CurrentUser from '../../current_user';
import Settings from '../../settings';
import Api from '../../api';
import { keyboardMap, restartButtonText } from '../../helpers';

export default class BattleStateWaiting extends BattleStateBase {
  setup() {
    this.game.playerBoard.overlay = m.trust(`Press ${restartButtonText()} to start.`);
    m.redraw();
  }

  teardown() {
    this.game.playerBoard.overlay = null;
    m.redraw();
  }

  deadInput(delta) {
    if (this.game.keyState.restart && !this.game.keyState.restartHandled) {
      this.startLoading();
    }
  }

  startLoading() {
    this.game.keyState.restartHandled = true;
    this.game.changeState(BattleStateLoading);
  }
}
