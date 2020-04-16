import m from 'mithril';
import { filter, find } from 'lodash/collection';

import OpponentBoard from '../../../components/_opponent_board';

export default class RoomStateBase {
  constructor(game) {
    this.game = game;
    this.setup();
  }

  setup() { }
  teardown() { }

  send(action, data={}) {
    this.game.recorder.send(action, data);
  }

  handle(message) {
    if (message.data.uuid && message.data.uuid === this.game.uuid) { return; }
    console.log(message);

    switch(message.action) {
      case 'connected':
        this.connected(message.data);
        break;

      case 'join':
        this.addPlayer(message.data);
        break;

      case 'leave':
        this.removePlayer(message.data);
        break;

      case 'ready':
        this.readyPlayer(message.data.uuid);
        break;

      case 'unready':
        this.unreadyPlayer(message.data.uuid);
        break;

      case 'start':
        this.start();
        break;

      default:
        console.log(`DUNNO HOW TO HANDLE: ${message.action}`);
    }
  }

  tick(delta) { }
  input(delta) { }

  addPlayer(player) {
    this.game.boards.push(new OpponentBoard(player));
    m.redraw();
  }

  removePlayer(player) {
    this.game.boards = filter(this.game.boards, board => board.id !== player.uuid)
    m.redraw();
  }

  findPlayer(uuid) {
    return find(this.game.boards, board => board.id === uuid);
  }

  readyPlayer(uuid) {
    this.findPlayer(uuid).ready();
  }

  unreadyPlayer(uuid) {
    this.findPlayer(uuid).unready();
  }

  start() {
    throw "Need to overload start in child class";
  }

  // All of these need to be handled in the respective child class
  connected(data) {
    throw "Need to overload connected in child class";
  }
}
