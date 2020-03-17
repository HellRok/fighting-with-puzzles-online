import m from 'mithril';

import Layout from './layout';
import ReplaysTable from './_replays_table';

import Api from '../lib/api';
import CurrentUser from '../lib/current_user';

export default class LeaderBoard {
  constructor() {
    this.sprints = [];
    this.ultras = [];
    this.survivals = [];
    this.loadData();
  }

  loadData() {
    Api.replaysLeaderboard().then(response => {
      this.sprints = response.sprints;
      this.ultras = response.ultras;
      this.survivals = response.survivals;
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', 'Leader Board'),

      m(ReplaysTable, {
        sprints: this.sprints,
        ultras: this.ultras,
        survivals: this.survivals,
      }),
    ]);
  }
};
