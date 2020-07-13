import m from 'mithril';

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
    this.battleTime = 12000; // 2 minutes
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
}
