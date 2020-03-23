import m from 'mithril';

import Layout from './layout';

import Api from '../lib/api';
import Rooms from '../lib/rooms';

export default class OnlinePresenter {
  oninit() {
    Rooms.refresh();
  }

  roomSubmit(event) {
    event.preventDefault();
    const form = event.target;

    Api.roomsCreate({
      name: form.name.value,
      settings: {
        max_players: 6,
      }
    }).then(response => {
      Rooms.current = response.data;
      console.table(Rooms.current);
      Rooms.refresh();
      m.route.set(`/room/${Rooms.current.id}`);
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', 'Online'),

      m('form.room-form', {
        onsubmit: e => { this.roomSubmit(e) }
      },[
        m('fieldset', [
          m('label', { for: 'name' }, 'Name'),
          m('input', { id: 'name', for: 'name' }, 'Name'),

          m('input.width-100', { type: 'submit', disabled: this.submitting })
        ])
      ]),

      Rooms.data.map(room => {
        return m('room-container', [
          m('room-name', room.name),
          m('room-players', room.players.length),
        ]);
      }),

    ]);
  }
};
