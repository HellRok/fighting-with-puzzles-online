import m from 'mithril';

import BattleStateBase from './base';
import BattleStateLoading from './loading';

import CurrentUser from '../../current_user';
import Settings from '../../settings';
import Api from '../../api';
import { keyboardMap } from '../../helpers';

export default class BattleStateWaiting extends BattleStateBase {
  setup() {
    if (Settings.site.displayMobileControls) {
      this.game.playerBoard.overlay = m.trust(`Press <span class="icon-restart"></span> to start.`);
    } else {
      this.game.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to start.`;
    }
    m.redraw();
  }

  teardown() {
    this.game.playerBoard.overlay = null;
    m.redraw();
  }

  tick(delta) {
    this.input(delta);
  }

  input(delta) {
    if (this.game.keyState.restart && !this.game.keyState.restartHandled) {
      this.startLoading();
    }
  }

  startLoading() {
    this.game.keyState.restartHandled = true;
    this.game.changeState(BattleStateLoading);
  }
}
