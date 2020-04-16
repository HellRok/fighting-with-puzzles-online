import m from 'mithril';

import RoomStateBase from './base';
import RoomStateReady from './ready';

import Settings from '../../settings';
import { keyboardMap }  from '../../helpers';

export default class RoomStateNotReady extends RoomStateBase {
  setup() {
    if (Settings.site.displayMobileControls) {
      this.game.playerBoard.overlay = m.trust(`Press <span class="icon-restart"></span> to ready up.`);
    } else {
      this.game.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to ready up.`;
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
      this.readyUp();
    }
  }

  readyUp() {
    this.game.recorder.readyUp()
    this.game.keyState.restartHandled = true;
    this.game.changeState(RoomStateReady);
  }
}
