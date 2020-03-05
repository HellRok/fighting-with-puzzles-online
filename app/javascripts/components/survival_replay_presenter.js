import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import SurvivalReplayer from '../lib/replayers/survival_replayer'
import { displayMilliseconds, displayScore, keyboardMap, bests } from '../lib/helpers';

export default class SurvivalReplayPresenter {
  constructor() {
    this.replayBoard = new Board();
  }

  oncreate(vnode) {
    this.replay = new SurvivalReplayer(this.replayBoard);
    this.replay.gameLoop();
    this.replay.renderLoop();
    this.replay.load(vnode.attrs.key);
  }

  onremove() {
    this.replay.destroy();
  }

  view() {
    return m(Layout, m('.survival-replay.single-player', [
      m('h2', 'Survival Replay'),
      m(this.replayBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(this.replayBoard.stats.runningTime))),
        m('.score', `Score: ${displayScore(this.replayBoard.stats.score)}`),
      ]),
    ]));
  }
};