import m from 'mithril';
import { min } from 'lodash/math';

import Player from '../player';
import BattleStateWaiting from './battle_states/waiting';
import BattleStateLoading from './battle_states/loading';
import ReplayRecorder from '../replay_recorder';
import Audio from '../audio';
import Settings from '../settings';
import Flash from '../flash';
import { timestamp, displayMilliseconds, displayScore, keyboardMap, restartButtonText } from '../helpers';

import CurrentUser from '../current_user';

export default class Battle extends Player {
  setup() {
    this.recorder = new ReplayRecorder('battle', this.seed);
    this.battleTime = 120000; // 2 minutes
    this.timeValue = document.querySelector('.time .value');
    this.changeState(BattleStateWaiting);
    this.lastGpm = 50;
  }

  tick(delta) {
    this.gameState.tick(delta);
  }

  deadInput() {
    if (this.keyState.restart) {
      this.attemptRestart();
    }
  }

  spawnGarbage() {
    this.battleState.lines += this.battleState.lineQueue;
    this.battleState.lineQueue = 0;
    this.recorder.addMove('currentLines', { lines: this.battleState.lines });
  }

  sendGarbage(damage) {
    const damageLines = Math.floor(super.sendGarbage(damage) / 6.0);
    this.sendLines(damageLines);
  }

  ko() {
    Audio.kod.play()
    super.ko();
  }

  lose(time) {
    super.lose();
    this.playerBoard.overlay = m.trust(`
      <h3>Lose</h3>
      Press ${restartButtonText()} to play again.
    `);
    this.opponentBoard.overlay = m.trust(`<h3>Victory!</h3>`);
    m.redraw();
    this.persist(4, 1);
  }

  attemptRestart() {
    if (!this.state.alive) {
      this.changeState(BattleStateLoading);
    };
  }
}
