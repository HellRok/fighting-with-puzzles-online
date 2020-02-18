import m from 'mithril';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings'
import Sprint from '../lib/game_modes/sprint'
import { displayMilliseconds, keyboardMap, bests } from '../lib/helpers';

export default class SprintPresenter {
  constructor() {
    this.playerBoard = new Board();
  }

  oncreate() {
    this.player = new Sprint(this.playerBoard);
    this.player.gameLoop();
    this.player.renderLoop();
    this.playerBoard.overlay = `Press ${keyboardMap[Settings.keys.restart]} to start.`;
  }

  onremove() {
    this.player.destroy();
  }

  bestTime() {
    return bests().sprintTime;
  }

  bestReplay() {
    return bests().sprintReplay;
  }

  view() {
    return m(Layout, m('.sprint.single-player', [
      m('h2', 'Sprint'),
      m('p', 'Clear 140 gems as quickly as possible.'),
      m('p', [
        m('.personal-best',
          this.bestTime() ?
          `Personal Best: ${displayMilliseconds(this.bestTime())}` :
          "You haven't played this mode yet! Play a game to get a best time."),
        (this.bestReplay() ? m(m.route.Link, {
          href: `/sprint/replay?replayData=${this.bestReplay()}`,
        }, m('.best-replay', 'Replay')) : ''),
      ]),
      m(this.playerBoard),
      m('.stats', [
        m('.time', 'Time: ', m('span.value', displayMilliseconds(this.playerBoard.stats.runningTime))),
        m('.gems-left', `Gems: ${140 - this.playerBoard.stats.gemsSmashed}`),
        ((this.player && this.player.lastReplay) ? m(m.route.Link, {
          href: `/sprint/replay?replayData=${this.player.lastReplay}`,
        }, m('.last-replay', 'Last Replay')) : ''),
      ]),
    ]));
  }
};
