import m from 'mithril';
import { min } from 'lodash/math';

import Player from '../player';
import Gem from '../gem';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import Flash from '../flash';
import { timestamp, displayMilliseconds, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Sprint extends Player {
  setup() {
    this.recorder = new ReplayRecorder('survival');
    this.playerBoard.stats.start = timestamp();
    this.nextDumpAt = 5000;
    this.dumpTotal = 0;
    this.dropPattern = [
      'red', 'orange', 'orange', 'red', 'red', 'orange',
      'red', 'orange', 'orange', 'red', 'red', 'orange',
      'blue', 'purple', 'purple', 'blue', 'blue', 'purple',
      'purple', 'blue', 'blue', 'purple', 'purple', 'blue',
    ]
  }

  tick(delta) {
    this.playerBoard.stats.runningTime += delta;
    this.recorder.currentTime = this.playerBoard.stats.runningTime;
    this.input(delta);

    if (!this.state.alive) { return; }

    this.timeValue.innerText = displayMilliseconds(this.playerBoard.stats.runningTime);

    this.dump(delta);
    this.gravity(delta);
  }

  dump(delta) {
    this.nextDumpAt -= delta;

    if (this.nextDumpAt <= 0) {
      this.dumpTotal += 1;
      const multiplier = min([this.dumpTotal * 2, 24]);
      this.nextDumpAt = 5000 + (2000 * multiplier);
      this.queueGarbage(
        multiplier,
        this.dropPattern
      );
    }
  }

  attemptRestart() {
    this.restart();
  }

  deadInput() {
    if (this.keyState.restart) {
      this.restart();
    }
  }

  lose(time) {
    // There really is no win condition since it's survival so let's just plug
    // into the lose method and use that
    super.win(time);
    this.recorder.addMove('lose');
    this.state.alive = false;

    this.recorder.persist(2, this.playerBoard.stats.runningTime, this.playerBoard.stats.score).then(response => {
      this.lastReplay = response.data;
      Flash.addFlash({
        text: 'Replay saved',
        href: `/survival/replay/${this.lastReplay.id}`,
        timeout: 5000,
      });
    });

    this.state.alive = false;
    let newBest = false;
    if (CurrentUser.isPresent()) {
      const oldBest = CurrentUser.data.bests.survival;
      newBest = oldBest ? (this.playerBoard.stats.runningTime > oldBest.time) : false;
      if (newBest) { CurrentUser.refresh(); }
    }

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You survived ${displayMilliseconds(this.playerBoard.stats.runningTime)}!
      ${ newBest ? `You improved your best by ${displayMilliseconds(this.playerBoard.stats.runningTime - oldBest.time)}` : ''}
    `);
    m.redraw();
  };
}
