import m from 'mithril';
import { sortBy } from 'lodash/collection';

import Api from '../lib/api';

export default class RoomItem {
  oninit(vnode) {
    this.room = vnode.attrs.room;
    this.loading = true;
    Api.get(
      `http://${this.room.gameServerUrl}/room/${this.room.id}`, 
      {
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Origin": "http://localhost:3001",
      }
    ).then(response => {
      console.log(response.data);
      this.players = response.data.players;
      this.loading = false;
    }).catch(error => {
      // Do nothing for now
    });
  }

  playerInfo(player) {
    return player.username ?
      m(m.route.Link, { class: 'player-name', href: `/profile/${player.id}` }, player.username) :
      m('.player-name', 'Anon');
  }

  view() {
    return m('.room', [
      m('.room-name', `Room: ${this.room.name}`),
      this.loading ?
        'Loading...' : [
          m('.room-players', [
            'Players: ',
            this.players.length === 0 ?
              'None' :
              sortBy(this.players, player => player.username).map(this.playerInfo)
          ]),
          m('.buttons', [
            m(m.route.Link, { class:'button join', href: `/room/${this.room.id}` }, 'Join')
          ]),
        ],
    ]);
  }
};
