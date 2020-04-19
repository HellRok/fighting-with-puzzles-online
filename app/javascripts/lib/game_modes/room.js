import m from 'mithril';

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

    this.socket = new WebSocket(`${gameServerUrl}/game/${roomId}`);
    this.changeState(RoomStateConnecting);

    this.socket.addEventListener('message', (e) => {
      this.gameState.handle(JSON.parse(e.data));
    });

    this.players = [];
  }

  changeState(newState) {
    if (this.gameState) { this.gameState.teardown(); }
    this.gameState = new newState(this);
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

  win(time) {
    super.win(time);
    this.recorder.addMove('win');

    this.state.alive = false;

    //this.recorder.persist(3, this.playerBoard.stats.runningTime, this.playerBoard.stats.score).then(response => {
    //  this.lastReplay = response.data;
    //  Flash.addFlash({
    //    text: 'Replay saved',
    //    href: `/sprint/replay/${this.lastReplay.id}`,
    //    timeout: 5000,
    //  });
    //});

    this.playerBoard.overlay = m.trust(`
      <h3>Finished</h3>
      You survived ${displayMilliseconds(time)}!
    `);
    m.redraw();
  }

  lose() {
    super.lose();
    this.playerBoard.overlay = 'Oh no, you topped out!';
    this.gameState.send('lose', { timestamp: this.recorder.currentTime });
  }


  // Can't restart a live match, so just do nothing
  attemptRestart() { }
}
