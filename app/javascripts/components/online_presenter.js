import m from 'mithril';

import Layout from './layout';
import RoomItem from './_room_item';

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
      Rooms.refresh();
      m.route.set(`/room/${Rooms.current.id}`);
    });
  }

  view() {
    return m(Layout,
      m('.max-width-960', [
        m('h2.text-centre', 'Online (Alpha)'),

        m('h3', 'Notes'),
        m('ul.notes', [
          m('li', [m('span.complete', "There's no diamond equivalent yet"),
            ' We now have the all-smasher!']),
          m('li', "I want to re-work the piece generation to slowly give more and more smashers as the game goes on"),
          m('li', [m('span.complete', "There will eventually be user defined drop patterns, until then it's the same as survival"),
            ' You can now set your drop pattern in the settings']),
          m('li', "User defined rooms and private rooms will be done down the line"),
          m('li', "Remember, this is really early in development so there will be bugs!"),
          m('li', m('a', { href: "https://twitter.com/hell_rok", target: '_blank' },  "If you find a bug, please report it to me on Twitter")),
        ]),

        //m('form.room-form', {
        //  onsubmit: e => { this.roomSubmit(e) }
        //},[
        //  m('fieldset', [
        //    m('label', { for: 'name' }, 'Name'),
        //    m('input', { id: 'name', for: 'name' }, 'Name'),

        //    m('input.width-100', { type: 'submit', disabled: this.submitting })
        //  ])
        //]),

        m('.rooms-container',
          Rooms.data.map(room => {
            return m(RoomItem, { room: room })
          }),
        ),
      ])
    );
  }
};
