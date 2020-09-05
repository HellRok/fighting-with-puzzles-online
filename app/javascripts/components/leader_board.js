import m from 'mithril';

import Layout from './layout';
import ReplaysTable from './_replays_table';

import Api from '../lib/api';
import CurrentUser from '../lib/current_user';
import { displayAsPercent } from '../lib/helpers';

export default class LeaderBoard {
  constructor() {
    this.sprints = [];
    this.ultras = [];
    this.survivals = [];
    this.battlers = [];
    this.loadData();
  }

  loadData() {
    Api.replaysLeaderboard().then(response => {
      this.sprints = response.sprints;
      this.ultras = response.ultras;
      this.survivals = response.survivals;
      this.battlers = response.battlers
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', 'Leader Board'),

      m('h3.text-centre', 'Battle'),
      m('table.max-width-960', [
        m('thead', m('tr', [
          m('th', 'Place'),
          m('th', 'User'),
          m('th', 'Wins'),
        ])),
        m('tbody',
          this.battlers.map((user, place) => m('tr', [
            m('td', place + 1),
            m('td', m(m.route.Link, { href: `/profile/${user.id}` }, user.username)),
            m('td', `${user.wins} wins (${displayAsPercent(user.wins / user.total)})`),
          ]))
        ),
      ]),

      m(ReplaysTable, {
        sprints: this.sprints,
        ultras: this.ultras,
        survivals: this.survivals,
      }),
    ]);
  }
};
