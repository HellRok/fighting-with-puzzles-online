import m from 'mithril';
import { filter } from 'lodash/collection';

import Board from '../../../components/_board';

export default class RoomStateBase {
  constructor(game) {
    this.game = game;
    this.setup();
  }

  setup() { }
  teardown() { }

  send(data) {
    this.game.recorder.send(data);
  }

  handle(message) {
    if (message.data.uuid === this.game.uuid) { return; }

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

      default:
        console.log(`DUNNO HOW TO HANDLE: ${message.action}`);
    }
  }

  tick(delta) { }
  input(delta) { }

  addPlayer(player) {
    this.game.boards.push(new Board(player.uuid));
    m.redraw();
  }

  removePlayer(player) {
    this.game.boards = filter(this.game.boards, board => board.id !== player.uuid)
    m.redraw();
  }

  // All of these need to be handled in the respective child class
  connected(data) {
    throw "Need to overload connected in child class";
  }
}
