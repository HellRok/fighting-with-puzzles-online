import m from 'mithril';

import RoomStateBase from './base';
import OnlineRecorder from '../../online_recorder';

import CurrentUser from '../../current_user';

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
    this.players = data.state.players;

    this.players.forEach(player => {
      this.addPlayer(player);
    });

    m.redraw();

    this.send('join', {
      id: CurrentUser.data.id,
      username: CurrentUser.data.username,
    });
  }
}
