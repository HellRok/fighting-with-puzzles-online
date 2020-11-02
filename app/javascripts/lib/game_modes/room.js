import m from 'mithril';
import { min } from 'lodash/math';

import Player from '../player';
import Opponent from '../opponent';
import RoomStateConnecting from './room_states/connecting';
import Settings from '../settings';
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

  destroy() {
    this.socket.close();
    clearTimeout(this.pingTimeout);
    super.destroy();
  }

  setup() {
    this.playerBoard.stats.start = timestamp();
    this.state.ready = false;
  }

  setSeed() {
    // Do nothing since setting the seed is handled by the gamestate
  }

  modeTick(delta)  { this.gameState.tick(delta); }
  deadInput(delta) { this.gameState.deadInput(delta); }

  updateInterface() {
    this.updateGPM();
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

    this.save(0);
    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You survived ${displayMilliseconds(time)}!
    `);
    m.redraw();
  }

  lose() {
    super.lose();
    this.save(1);
    this.playerBoard.overlay = 'Oh no, you topped out!';
    this.gameState.send('lose', { timestamp: this.recorder.currentTime });
  }

  save(result) {
    this.updateGPM();
    this.persist(3, result);
  }

  // Can't restart a live match, so just do nothing
  attemptRestart() { }
}
