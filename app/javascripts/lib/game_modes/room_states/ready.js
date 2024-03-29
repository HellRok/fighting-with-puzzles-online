import m from 'mithril';

import RoomStateBase from './base';
import RoomStateNotReady from './not_ready';
import RoomStatePlaying from './playing';

import Settings from '../../settings';
import { keyboardMap }  from '../../helpers';

export default class RoomStateReady extends RoomStateBase {
  setup() {
    if (Settings.site.displayMobileControls) {
      this.game.playerBoard.overlay = m.trust(`Press <span class="icon-restart"></span> to unready.`);
    } else {
      this.game.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to unready.`;
    }
    m.redraw();
  }

  teardown() {
    this.game.playerBoard.overlay = null;
    m.redraw();
  }

  deadInput(delta) {
    if (this.game.keyState.restart && !this.game.keyState.restartHandled) {
      this.unready();
    }
  }

  unready() {
    this.game.recorder.unready()
    this.game.keyState.restartHandled = true;
    this.game.changeState(RoomStateNotReady);
  }

  start(seed) {
    this.game.seed = seed;
    this.game.opponents.forEach(opponent => {
      opponent.seed = seed;
      opponent.playerBoard.overlay = null;
      opponent.playerBoard.player.state = 'playing';
    });
    this.game.changeState(RoomStatePlaying);
  }
}
