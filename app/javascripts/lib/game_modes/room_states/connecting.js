import m from 'mithril';

import RoomStateBase from './base';
import RoomStateNotReady from './not_ready';
import RoomStateLost from './lost';
import OnlineRecorder from '../../online_recorder';

import CurrentUser from '../../current_user';
import Settings from '../../settings';

export default class RoomStateConnecting extends RoomStateBase {
  setup() {
    this.game.playerBoard.overlay = 'Connecting...';
    m.redraw();
  }

  teardown() {
    this.game.playerBoard.overlay = null;
    m.redraw();
  }

  connected(data) {
    this.game.uuid = data.uuid;
    this.game.recorder = new OnlineRecorder(this.game.socket, data.uuid);
    this.players = data.players;

    this.players.forEach(player => {
      this.addPlayer(player);
    });

    m.redraw();

    this.send('join', {
      id: CurrentUser.data.id,
      username: CurrentUser.data.username,
      dropPattern: Settings.game.dropPattern,
    });

    switch(data.state) {
      case 'waiting':
        this.game.changeState(RoomStateNotReady);
        break;

      case 'playing':
        this.game.changeState(RoomStateLost);
        break;

      default:
        console.log(`DUNNO HOW TO HANDLE STATE ${data.state}`);
    }
  }
}
