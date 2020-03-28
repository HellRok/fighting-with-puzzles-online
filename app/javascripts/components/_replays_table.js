import m from 'mithril';

import { displayMilliseconds, displayScore, displayDate, replayVersion } from '../lib/helpers';

export default class ReplaysTable {
  view(vnode) {
    return [
      m('h3.text-centre', 'Sprints'),
      m('table.max-width-960', [
        m('thead', m('tr', [
          m('th', 'Place'),
          m('th', 'User'),
          m('th', 'Time'),
          m('th', 'Date'),
        ])),
        m('tbody',
          vnode.attrs.sprints.map((replay, place) => m('tr', [
            m('td', place + 1),
            m('td', m(m.route.Link, { href: `/profile/${replay.user.id}` }, replay.user.username)),
            (replay.version === replayVersion() ?
              m('td', m(m.route.Link, { href: `/sprint/replay/${replay.id}` }, displayMilliseconds(replay.time))) :
              m('td', { title: "Can't play old replays" }, displayMilliseconds(replay.time))),
            m('td', displayDate(replay.createdAt)),
          ]))
        ),
      ]),

      m('h3.text-centre', 'Ultras'),
      m('table.max-width-960', [
        m('thead', m('tr', [
          m('th', 'Place'),
          m('th', 'User'),
          m('th', 'Score'),
          m('th', 'Date'),
        ])),
        m('tbody',
          vnode.attrs.ultras.map((replay, place) => m('tr', [
            m('td', place + 1),
            m('td', m(m.route.Link, { href: `/profile/${replay.user.id}` }, replay.user.username)),
            (replay.version === replayVersion() ?
              m('td', m(m.route.Link, { href: `/ultra/replay/${replay.id}` }, displayScore(replay.score))) :
              m('td', { title: "Can't play old replays" }, displayScore(replay.score))),
            m('td', displayDate(replay.createdAt)),
          ]))
        ),
      ]),

      m('h3.text-centre', 'Survivals'),
      m('table.max-width-960', [
        m('thead', m('tr', [
          m('th', 'Place'),
          m('th', 'User'),
          m('th', 'Time'),
          m('th', 'Date'),
        ])),
        m('tbody',
          vnode.attrs.survivals.map((replay, place) => m('tr', [
            m('td', place + 1),
            m('td', m(m.route.Link, { href: `/profile/${replay.user.id}` }, replay.user.username)),
            (replay.version === replayVersion() ?
              m('td', m(m.route.Link, { href: `/survival/replay/${replay.id}` }, displayMilliseconds(replay.time))) :
              m('td', { title: "Can't play old replays" }, displayMilliseconds(replay.time))),
            m('td', displayDate(replay.createdAt)),
          ]))
        ),
      ]),
    ];

  }
};
