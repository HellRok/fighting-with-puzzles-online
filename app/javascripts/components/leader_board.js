import m from 'mithril';

import Layout from './layout';
import { displayMilliseconds, displayScore } from '../lib/helpers';

import Api from '../lib/api';
import CurrentUser from '../lib/current_user';

export default class LeaderBoard {
  constructor() {
    this.sprints = [];
    this.ultras = [];
    this.loadData();
  }

  loadData() {
    Api.replaysLeaderboard().then(response => {
      this.sprints = response.sprints;
      this.ultras = response.ultras;
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', 'Leader Board'),

      m('h3.text-centre', 'Sprints'),
      m('table.max-width-960', [
        m('thead', m('tr', [
          m('th', 'Place'),
          m('th', 'User'),
          m('th', 'Time'),
        ])),
        m('tbody',
          this.sprints.map((replay, place) => m('tr', [
            m('td', place + 1),
            m('td', replay.user ? replay.user.username : 'Anonymous'),
            m('td', m(m.route.Link, { href: `/sprint/replay?replayData=${replay.data}` }, displayMilliseconds(replay.time)))
          ]))
        ),
      ]),

      m('h3.text-centre', 'Ultras'),
      m('table.max-width-960', [
        m('thead', m('tr', [
          m('th', 'Place'),
          m('th', 'User'),
          m('th', 'Score'),
        ])),
        m('tbody',
          this.ultras.map((replay, place) => m('tr', [
            m('td', place + 1),
            m('td', replay.user ? replay.user.username : 'Anonymous'),
            m('td', m(m.route.Link, { href: `/ultra/replay?replayData=${replay.data}` }, displayScore(replay.score)))
          ]))
        ),
      ]),
    ]);
  }
};
