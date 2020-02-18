import m from 'mithril';
import kissc from '../vendor/kissc';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import SprintReplayer from '../lib/replayers/sprint_replayer'
import { displayMilliseconds, keyboardMap, bests } from '../lib/helpers';

export default class SprintReplayPresenter {
  constructor() {
    this.replayBoard = new Board();
  }

  oncreate(vnode) {
    this.replay = new SprintReplayer(this.replayBoard);
    this.replay.gameLoop();
    this.replay.renderLoop();
    this.replay.load(JSON.parse(kissc.decompress(vnode.attrs.replayData)));
  }

  onremove() {
    this.replay.destroy();
  }

  view() {
    return m(Layout, m('.sprint-replay.single-player', [
      m('h2', 'Sprint Replay'),
      m(this.replayBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(this.replayBoard.stats.runningTime))),
        m('.gems-left', `Gems: ${140 - this.replayBoard.stats.gemsSmashed}`),
      ]),
    ]));
  }
};
