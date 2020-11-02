import m from 'mithril';

import Flash from '../../flash';
import { displayMilliseconds, restartButtonText } from '../../helpers';

import BattleStateBase from './base';
import BattleStateWaiting from './waiting';

export default class BattleStatePlaying extends BattleStateBase {
  setup() {
    this.game.restart();
  }

  teardown() {
    m.redraw();
  }

  deadInput() {
    if (this.game.keyState.restart) {
      this.game.attemptRestart();
    }
  }

  tick(delta) {
    this.game.opponentBoard.player.tick(delta);

    if (this.game.playerBoard.stats.runningTime >= this.game.battleTime) {
      this.finish();
    }
  }

  finish(time) {
    this.game.state.alive = false;
    this.game.opponentBoard.player.state.alive = false;
    this.game.updateGPM();
    this.game.opponentBoard.player.updateGPM(0);

    // Because we're very rarely going to end on the exact millisecond we
    // expect, we just fudge the numbers slightly to make it look exact.
    this.game.timeValue.innerText = displayMilliseconds(0);
    this.game.lastGpm = this.game.playerBoard.stats.gpm;

    if (this.game.battleState.kos > this.game.opponentBoard.player.battleState.kos) {
      this.win(time);
    } else if (this.game.battleState.kos < this.game.opponentBoard.player.battleState.kos) {
      this.lose(time);
    } else if (
      (this.game.battleState.lines + this.game.battleState.lineQueue) <
        (this.game.opponentBoard.player.battleState.lines + this.game.opponentBoard.player.battleState.lineQueue)) {
      this.win(time);
    } else if (
      (this.game.opponentBoard.player.battleState.lines + this.game.opponentBoard.player.battleState.lineQueue) <
        (this.game.battleState.lines + this.game.battleState.lineQueue)) {
      this.lose(time);
    } else {
      this.draw(time);
    }
  }

  win(time) {
    this.game.win(time);

    this.game.playerBoard.overlay = m.trust(`
      <h3>Victory!</h3>
      Press ${restartButtonText()} to play again.
    `);
    this.game.opponentBoard.overlay = m.trust(`<h3>Lose</h3>`);
    m.redraw();
    this.game.persist(4, 0);
  }

  lose(time) {
    this.game.lose(time);
  }

  draw(time) {
    this.game.playerBoard.overlay = m.trust(`<h3>Draw</h3>`);
    this.game.opponentBoard.overlay = m.trust(`<h3>Draw</h3>`);
    m.redraw();
    this.game.persist(4, 2);
  }

  attack(data) {
    const attacker = this.findPlayer(data.attackerUuid);
    this.game.queueGarbage(data.damage, attacker.playerBoard.player.dropPattern);
    m.redraw();
  }
}
