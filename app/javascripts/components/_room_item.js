import m from 'mithril';
import { sortBy } from 'lodash/collection';

import Api from '../lib/api';

export default class RoomItem {
  oninit(vnode) {
    this.room = vnode.attrs.room;
    this.loading = true;
    this.state = null;
    this.refresh();
    this.refreshTimeout;
  }

  refresh() {
    Api.get(
      `${window.location.protocol}//${this.room.gameServerUrl}/room/${this.room.id}`,
      {
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Origin": "${window.location}",
      }
    ).then(response => {
      this.state = response.data.state
      this.players = response.data.players;
      this.loading = false;
    }).catch(error => {
      // Do nothing for now
    });

    this.refreshTimeout = setTimeout(() => { this.refresh() }, (2000 + (Math.random() * 500)));
  }

  onremove() {
    clearTimeout(this.refreshTimeout);
  }

  playerInfo(player) {
    return player.username ?
      m(m.route.Link, { class: 'player-name', href: `/profile/${player.id}` }, player.username) :
      m('.player-name', 'Anon');
  }

  displayState() {
    switch(this.state) {
      case 'waiting':
        return [m('.icon-clock'), 'between games'];
        break;

      case 'playing':
        return [m('.icon-flag'), 'game in progress'];
        break;

      default:
        return '';
    };
  }

  view() {
    return m('.room', [
      m('.room-name', `Room: ${this.room.name}`),
      m('.room-state', this.displayState()),
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
