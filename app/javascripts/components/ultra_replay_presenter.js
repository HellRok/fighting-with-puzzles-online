import m from 'mithril';
import kissc from '../vendor/kissc';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import UltraReplayer from '../lib/replayers/ultra_replayer'
import { displayMilliseconds, displayScore, keyboardMap, bests } from '../lib/helpers';

export default class UltraReplayPresenter {
  constructor() {
    this.replayBoard = new Board();
  }

  oncreate(vnode) {
    this.replay = new UltraReplayer(this.replayBoard);
    this.replay.gameLoop();
    this.replay.renderLoop();
    this.replay.load(JSON.parse(kissc.decompress(vnode.attrs.replayData)));
  }

  onremove() {
    this.replay.destroy();
  }

  view() {
    return m(Layout, m('.ultra-replay.single-player', [
      m('h2', 'Ultra Replay'),
      m(this.replayBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(0))),
        m('.score', `Score: ${displayScore(this.replayBoard.stats.score)}`),
      ]),
    ]));
  }
};

