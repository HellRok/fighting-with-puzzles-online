import m from 'mithril';
import { isEmpty } from 'lodash/lang';

import Layout from './layout';
import PlayerBoard from './_player_board';
import Settings from '../lib/settings';

import Api from '../lib/api';
import Rooms from '../lib/rooms';
import Room from '../lib/game_modes/room';

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

  setup(roomId) {
    this.player = new Room(this.playerBoard, null, roomId, Rooms.current.gameServerUrl);
    this.player.gameLoop();
    this.player.renderLoop();
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', ['Room: ', Rooms.current.name]),
      m(this.playerBoard),
      this.player ? this.player.opponents.map(opponent => m(opponent.playerBoard)) : '',
    ]);
  }
};
