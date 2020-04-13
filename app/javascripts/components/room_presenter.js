import m from 'mithril';
import { isEmpty } from 'lodash/lang';

import Layout from './layout';
import Board from './_board';
import Settings from '../lib/settings';

import Api from '../lib/api';
import Rooms from '../lib/rooms';
import Room from '../lib/game_modes/room';

export default class RoomPresenter {
  constructor() {
    this.playerBoard = new Board(1);
  }

  oncreate(vnode) {
    if (isEmpty(Rooms.current)) {
      Api.roomsFind(vnode.key).then(response => Rooms.current = response);
    }

    this.player = new Room(this.playerBoard, null, this.boards, vnode.key);
    this.player.gameLoop();
    this.player.renderLoop();
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', ['Room: ', Rooms.current.name]),
      m(this.playerBoard),
      this.player ? this.player.boards.map(board => m(board)) : '',
    ]);
  }
};
