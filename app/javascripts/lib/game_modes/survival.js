import m from 'mithril';
import { min } from 'lodash/math';

import Player from '../player';
import Gem from '../gem';
import ReplayRecorder from '../replay_recorder';
import Settings from '../settings';
import { timestamp, displayMilliseconds, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Sprint extends Player {
  setup() {
    this.dumpText = document.querySelector('.next-dump');
    this.recorder = new ReplayRecorder('survival', this.seed);
    this.nextDumpAt = 5000;
    this.dumpTotal = 1;
    this.dumpMultiplier = 2;
    this.dropPattern = [
      'red', 'orange', 'orange', 'red', 'red', 'orange',
      'red', 'orange', 'orange', 'red', 'red', 'orange',
      'blue', 'purple', 'purple', 'blue', 'blue', 'purple',
      'purple', 'blue', 'blue', 'purple', 'purple', 'blue',
    ]
  }

  modeTick(delta) {
    this.dump(delta);
  }

  updateInterface() {
    super.updateInterface();
    this.dumpText.innerText = `${this.dumpMultiplier} garbage in ${displayMilliseconds(this.nextDumpAt)}`;
  }

  dump(delta) {
    this.nextDumpAt -= delta;

    if (this.nextDumpAt <= 0) {
      this.recorder.addMove('dump');
      this.queueGarbage(
        this.dumpMultiplier,
        this.dropPattern
      );
      this.nextDumpAt = 5000 + (1000 * this.dumpMultiplier);
      this.dumpTotal += 1;
      this.dumpMultiplier = min([this.dumpTotal * 2, 24]);

      m.redraw()
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
    this.updateGPM();

    this.persist(2, 0);

    this.state.alive = false;
    let newBest = false;
    let oldBest;
    if (CurrentUser.isPresent()) {
      oldBest = CurrentUser.data.bests.survival;
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
