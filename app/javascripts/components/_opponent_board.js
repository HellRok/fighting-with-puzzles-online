import m from 'mithril';

import Board from './_board';

export default class OpponentBoard extends Board {
  constructor(player) {
    super(player.uuid);
    this.player = player;
    this.unready();
  }

  ready() {
    this.overlay = 'Ready!';
    m.redraw();
  }

  unready() {
    this.overlay = 'Waiting...';
    m.redraw();
  }

  view(vnode) {
    return [
      m('.player-board', [
        super.view(vnode),
        m('.stats', [
          (this.player.id ?
            m(m.route.Link, { href: `/profile/${this.player.id}` }, this.player.username) :
            'Anon')
        ]),
      ])
    ];
  }
}
