import m from 'mithril';

import Flash from '../../flash';

import RoomStateBase from './base';
import RoomStateNotReady from './not_ready';

export default class RoomStatePlaying extends RoomStateBase {
  setup() {
    this.game.restart();
    this.game.opponents.forEach(opponent => opponent.restart());
  }

  teardown() {
    this.game.playerBoard.clear();
    this.game.opponents.forEach(opponent => {
      opponent.playerBoard.clear();
      opponent.playerBoard.overlay = 'Waiting...';
    });
    m.redraw();
  }

  tick(delta) {
    this.game.opponents.forEach(opponent => {
      opponent.playerBoard.stats.runningTime = this.game.playerBoard.stats.runningTime;
      opponent.updateGPM()
    });
  }

  losePlayer(uuid) {
    this.findPlayer(uuid).playerBoard.lose();
  }

  winPlayer(uuid, timestamp) {
    // When a player disconnects there is no timestamp, so just assume now
    timestamp = timestamp ? timestamp : this.game.playerBoard.stats.runningTime;

    if (uuid === this.game.uuid) {
      Flash.addFlash({
        text: 'You won!',
        level: 'success',
        timeout: 5000,
      });
      this.game.win(timestamp);
    } else {
      const winner = this.findPlayer(uuid);
      winner.win(timestamp);
      Flash.addFlash({
        text: `${winner.playerBoard.player.username || 'Anon'} won!`,
        level: 'info',
        timeout: 5000,
      });
    }

    setTimeout(() => {
      this.game.changeState(RoomStateNotReady);
    }, 5000);
  }

  movePlayer(response) {
    const player = this.findPlayer(response.uuid);
    player.executeMove(response)
  }

  attack(data) {
    const attacker = this.findPlayer(data.attackerUuid);
    this.game.queueGarbage(data.damage, attacker.playerBoard.dropPattern);
    m.redraw();
  }
}
