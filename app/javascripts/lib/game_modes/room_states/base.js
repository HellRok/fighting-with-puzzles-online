import m from 'mithril';
import { filter, find } from 'lodash/collection';

import OpponentBoard from '../../../components/_opponent_board';
import Opponent from '../../opponent';

import Flash  from '../../flash';

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

    switch(message.action) {
      case 'server_shutdown':
        Flash.addFlash({
          level: 'warning',
          text: 'Server shutting down...',
        });
        m.route.set('/online');
        break;

      case 'connected':
        this.connected(message.data);
        break;

      case 'join':
        this.addPlayer(message.data);
        break;

      case 'leave':
        this.removePlayer(message.data.uuid);
        break;

      case 'ready':
        this.readyPlayer(message.data.uuid);
        break;

      case 'unready':
        this.unreadyPlayer(message.data.uuid);
        break;

      case 'start':
        this.start(message.data.seed);
        break;

      case 'lost':
        this.losePlayer(message.data.uuid);
        break;

      case 'won':
        this.winPlayer(message.data.winner, message.data.timestamp);
        break;

      case 'move':
        this.movePlayer(message.data, message.data.timestamp);
        break;

      default:
        console.log(`DUNNO HOW TO HANDLE: ${message.action}`);
    }
  }

  tick(delta) { }
  input(delta) { }

  addPlayer(player) {
    const newBoard = new OpponentBoard(player);
    const newOpponent = new Opponent(newBoard);
    this.game.opponents.push(newOpponent);

    if (player.state === 'ready') {
      newOpponent.ready();
    } else if (player.state === 'playing') {
      newOpponent.playerBoard.overlay = undefined;
    }

    m.redraw();
  }

  removePlayer(uuid) {
    this.game.opponents = filter(this.game.opponents, opponent => opponent.playerBoard.id !== uuid)
    m.redraw();
  }

  findPlayer(uuid) {
    return find(this.game.opponents, opponent => opponent.playerBoard.id === uuid);
  }

  readyPlayer(uuid) {
    this.findPlayer(uuid).playerBoard.ready();
  }

  unreadyPlayer(uuid) {
    this.findPlayer(uuid).playerBoard.unready();
  }

  losePlayer(uuid) {
    throw 'Need to overload losePlayer in child class';
  }

  winPlayer(uuid, timestamp) {
    throw 'Need to overload winPlayer in child class';
  }

  movePlayer(data, timestamp) {
    throw 'Need to overload winPlayer in child class';
  }

  start() {
    throw "Need to overload start in child class";
  }

  // All of these need to be handled in the respective child class
  connected(data) {
    throw "Need to overload connected in child class";
  }
}
