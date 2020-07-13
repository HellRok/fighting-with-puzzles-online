import m from 'mithril';

import Flash from '../../flash';
import { displayMilliseconds } from '../../helpers';

import BattleStateBase from './base';
import BattleStateWaiting from './waiting';

export default class BattleStatePlaying extends BattleStateBase {
  setup() {
    this.game.restart();
  }

  teardown() {
    m.redraw();
  }

  tick(delta) {
    this.game.playerBoard.stats.runningTime += delta;
    this.game.recorder.currentTime = this.game.playerBoard.stats.runningTime;

    if (!this.game.state.alive) { return; }

    this.game.aliveInput(delta);

    this.game.timeValue.innerText = displayMilliseconds(this.game.battleTime - this.game.playerBoard.stats.runningTime);
    this.game.updateGPM();

    this.game.gravity(delta);

    this.game.opponentBoard.player.tick(delta);
    this.game.opponentBoard.player.updateGPM();

    if (this.game.playerBoard.stats.runningTime >= this.game.battleTime) {
      this.finish();
    }
  }

  finish(time) {
    this.game.state.alive = false;
    this.game.opponentBoard.player.state.alive = false;
    this.game.updateGPM();
    this.game.opponentBoard.player.updateGPM(0);

    this.game.recorder.persist(
      4,
      this.game.playerBoard.stats.runningTime,
      this.game.playerBoard.stats.score,
      this.game.playerBoard.stats.gpm
    );

    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.game.timeValue.innerText = displayMilliseconds(0);

    // TODO: actual win/lose conditions
    this.win(time);

    this.game.changeState(BattleStateWaiting);
  }

  win(time) {
    this.game.win(time);

    this.game.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
    `);
    m.redraw();
  }

  attack(data) {
    const attacker = this.findPlayer(data.attackerUuid);
    this.game.queueGarbage(data.damage, attacker.playerBoard.player.dropPattern);
    m.redraw();
  }
}
