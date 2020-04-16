import m from 'mithril';

import RoomStateBase from './base';
//import RoomStateLost from './lost';

export default class RoomStatePlaying extends RoomStateBase {
  setup() {
    this.game.restart();
  }

  tick(delta) {
    this.game.aliveInput(delta);

    if (!this.game.state.alive) { return; }

    this.game.playerBoard.stats.runningTime += delta;
    this.game.recorder.currentTime = this.game.playerBoard.stats.runningTime;

    this.game.gravity(delta);
  }

  lose() {
    //this.game.changeState(RoomStateLost);
  }
}
