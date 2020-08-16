import m from 'mithril';
import { min } from 'lodash/math';

import Player from '../player';
import BattleStateWaiting from './battle_states/waiting';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import Flash from '../flash';
import { timestamp, displayMilliseconds, displayScore, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Battle extends Player {
  setup() {
    this.recorder = new ReplayRecorder('battle', this.seed);
    this.battleTime = 120000; // 2 minutes
    this.timeValue = document.querySelector('.time .value');
    this.changeState(BattleStateWaiting);
  }

  tick(delta) {
    this.gameState.tick(delta);
  }

  deadInput() {
    if (this.keyState.restart) {
      this.restart();
    }
  }

  attemptRestart() {
    this.restart();
  }

  spawnGarbage() {
    console.log("GARBAGE SPAWNING");
    this.battleState.lines += this.battleState.lineQueue;
    console.log(this.battleState.lines);
    this.battleState.lineQueue = 0;
    this.recorder.addMove('currentLines', { lines: this.battleState.lines });
  }

  sendGarbage(damage) {
    const damageLines = Math.floor(super.sendGarbage(damage) / 6.0);
    this.sendLines(damageLines);
  }
}
