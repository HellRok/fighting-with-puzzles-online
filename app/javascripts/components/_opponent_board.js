import m from 'mithril';

import Board from './_board';

import { displayMilliseconds }  from '../lib/helpers';

export default class OpponentBoard extends Board {
  constructor(player, dropPattern) {
    super(player.uuid);
    this.player = player;
    this.dropPattern = dropPattern
    this.unready();
  }

  ready() {
    this.overlay = 'Ready!';
    this.player.state = 'ready';
    m.redraw();
  }

  unready() {
    this.overlay = 'Waiting...';
    this.player.state = 'unready';
    m.redraw();
  }

  lose() {
    this.overlay = 'Topped out.';
    this.player.state = 'unready';
    m.redraw();
  }

  win(timestamp) {
    this.overlay = `Winner! They survived ${displayMilliseconds(timestamp)}.`;
    this.player.state = 'unready';
    m.redraw();
  }

  view(vnode) {
    return [
      m('.opponent-board', [
        super.view(vnode),
        m('.stats', [
          (this.player.id ?
            m(m.route.Link, { href: `/profile/${this.player.id}` }, this.player.username) :
            'Anon'),
          m('.gpm', { title: 'Garbage per minute' }, `GPM: ${this.stats.gpm.toFixed(2)}`),
        ]),
      ])
    ];
  }
}
