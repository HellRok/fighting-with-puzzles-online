import m from 'mithril';
import { isEmpty } from 'lodash/lang';

import Layout from './layout';
import PlayerBoard from './_player_board';
import Settings from '../lib/settings';

import Api from '../lib/api';
import Rooms from '../lib/rooms';
import Room from '../lib/game_modes/room';
import RoomStatePlaying from '../lib/game_modes/room_states/playing';

export default class RoomPresenter {
  constructor() {
    this.playerBoard = new PlayerBoard(1);
  }

  oncreate(vnode) {
    if (isEmpty(Rooms.current)) {
      Api.roomsFind(vnode.key).then(response => {
        Rooms.current = response;
        this.setup(vnode.key);
      });
    } else {
      this.setup(vnode.key);
    }
  }

  onremove() {
    this.player.destroy();
  }

  opponentCount() {
    if (!this.player) { return '0 / 0'; }

    const total = this.player.opponents.length;
    let count = 0;
    if (this.opponentState() === 'Alive') {
      count = this.player.opponents.filter(opponent => opponent.playerBoard.player.state === 'playing').length;
    } else {
      count = this.player.opponents.filter(opponent => opponent.playerBoard.player.state === 'ready').length;
    }

    return `${count} / ${total}`;
  }

  opponentState() {
    if (!this.player) { return 'Alive'; }

    if (this.player.gameState instanceof RoomStatePlaying) {
      return 'Alive';
    } else {
      return 'Ready';
    }
  }

  roomSize() {
    if (this.player && this.player.opponents) {
      if (this.player.opponents.length === 0) { return 'solo'; }
      if (this.player.opponents.length === 1) { return 'full'; }
    }

    return 'shrink';
  }

  setup(roomId) {
    this.player = new Room(this.playerBoard, null, roomId, Rooms.current.gameServerUrl);
    this.player.gameLoop();
    this.player.renderLoop();
  }

  view() {
    return m(Layout,
      m('h2.text-centre', ['Room: ', Rooms.current.name]),
      m('.room-presenter', { class: this.roomSize() }, [
        m(this.playerBoard),
        m('.opponent-count', [
          m('.oppenent-count-value', this.opponentCount()),
          m('.oppenent-count-text', this.opponentState()),
        ]),
        m('.opponents',
          this.player ? this.player.opponents.map(opponent => m(opponent.playerBoard, { key: opponent.playerBoard.id })): '',
        ),
      ])
    );
  }
};
