import m from 'mithril';
import { min } from 'lodash/math';

import Player from '../player';
import Opponent from '../opponent';
import RoomStateConnecting from './room_states/connecting';
import Settings from '../settings';
import Flash from '../flash';
import { timestamp, displayMilliseconds, keyboardMap } from '../helpers';

import CurrentUser from '../current_user';

export default class Room extends Player {
  constructor(playerBoard, seed, roomId, gameServerUrl) {
    super(playerBoard);

    const protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
    this.socket = new WebSocket(`${protocol}//${gameServerUrl}/room/${roomId}`);
    this.changeState(RoomStateConnecting);

    this.socket.addEventListener('message', (e) => {
      this.gameState.handle(JSON.parse(e.data));
    });

    this.socket.addEventListener('open', (e) => {
      this.ping();
    });

    this.players = [];
  }

  ping() {
    if (this.recorder) {
      if (this.socket.readyState > 1) {
        Flash.addFlash({
          level: 'warning',
          text: 'Lost connection to server...',
        });
        m.route.set('/online');
      }

      this.recorder.send('ping');
    }
    this.pingTimeout = setTimeout(() => this.ping(), 1000);
  }

  changeState(newState) {
    if (this.gameState) { this.gameState.teardown(); }
    this.gameState = new newState(this);
  }

  destroy() {
    this.socket.close();
    clearTimeout(this.pingTimeout);
    super.destroy();
  }

  setup() {
    this.playerBoard.stats.start = timestamp();
    this.state.ready = false;
  }

  tick(delta)  { this.gameState.tick(delta); }
  input(delta) { this.gameState.input(delta); }

  deadInput() {
    if (this.keyState.restart && !this.keyState.restartHandled) {
      this.readyUp();
    }
  }

  readyUp() {
    this.recorder.readyUp()
    this.keyState.restartHandled = true;
  }

  sendGarbage(damage) {
    if (super.sendGarbage(damage) > 0) {
      this.gameState.send('attack', { damage: damage });
    }
  }

  win(time) {
    super.win(time);
    this.recorder.addMove('win');

    this.state.alive = false;

    this.save();
    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You survived ${displayMilliseconds(time)}!
    `);
    m.redraw();
  }

  lose() {
    super.lose();
    this.save();
    this.playerBoard.overlay = 'Oh no, you topped out!';
    this.gameState.send('lose', { timestamp: this.recorder.currentTime });
  }

  save() {
    this.recorder.persist(3, this.playerBoard.stats.runningTime, this.playerBoard.stats.score).then(response => {
      this.lastReplay = response.data;
      Flash.addFlash({
        text: 'Replay saved',
        //href: `/online/replay/${this.lastReplay.id}`,
        timeout: 5000,
      });
    });
  }


  // Can't restart a live match, so just do nothing
  attemptRestart() { }
}
