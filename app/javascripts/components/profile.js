import m from 'mithril';

import Layout from './layout';
import ReplaysTable from './_replays_table';

import { displayHumanMilliseconds, displayScore, replayVersion } from '../lib/helpers';
import Api from '../lib/api';
import CurrentUser from '../lib/current_user';
import UserModel from '../lib/models/user_model';

export default class Profile {
  constructor() {
    this.user = new UserModel;
    this.sprints = [];
    this.ultras = [];
    this.survivals = [];
  }

  oninit(vnode) {
    this.userId = vnode.key;
    this.loadData();
  }

  loadData() {
    Api.usersFind(this.userId).then(response => {
      this.user = response;
    });

    Api.replaysForUser(this.userId).then(response => {
      this.sprints = response.sprints;
      this.ultras = response.ultras;
      this.survivals = response.survivals;
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', this.user.username),

      m('table.max-width-50', [
        m('thead',
          m('tr', [
            m('th', 'Mode'),
            m('th', 'Games Played'),
            m('th', 'Time Played'),
          ]),
        ),
        m('tbody', [
          m('tr', [
            m('td', 'Online'),
            m('td', this.user.stats.online.count),
            m('td', displayHumanMilliseconds(this.user.stats.online.time)),
          ]),
          m('tr', [
            m('td', 'Sprint'),
            m('td', this.user.stats.sprints.count),
            m('td', displayHumanMilliseconds(this.user.stats.sprints.time)),
          ]),
          m('tr', [
            m('td', 'Ultra'),
            m('td', this.user.stats.ultras.count),
            m('td', displayHumanMilliseconds(this.user.stats.ultras.time)),
          ]),
          m('tr', [
            m('td', 'Survival'),
            m('td', this.user.stats.survivals.count),
            m('td', displayHumanMilliseconds(this.user.stats.survivals.time)),
          ]),
          m('tr', [
            m('td', 'Total'),
            m('td', this.user.stats.games.count),
            m('td', displayHumanMilliseconds(this.user.stats.games.time)),
          ]),
        ]),
      ]),

      m(ReplaysTable, {
        sprints: this.sprints,
        ultras: this.ultras,
        survivals: this.survivals,
      }),
    ]);
  }
};
