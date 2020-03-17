import m from 'mithril';

import Layout from './layout';
import ReplaysTable from './_replays_table';

import { displayMilliseconds, displayScore, replayVersion } from '../lib/helpers';
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
            m('th', 'Game Mode'),
            m('th', 'Times Played'),
          ]),
        ),
        m('tbody', [
          m('tr', [m('td', 'Sprint'), m('td', this.user.stats.total_sprints_finished)]),
          m('tr', [m('td', 'Ultra'), m('td', this.user.stats.total_ultras_finished)]),
          m('tr', [m('td', 'Survival'), m('td', this.user.stats.total_survivals_finished)]),
          m('tr', [m('td', 'Total'), m('td', this.user.stats.total_games_finished)]),
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
