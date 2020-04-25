import Api from '../api';
import BaseModel from './base_model';
import ReplayModel from './replay_model';

export default class UserModel extends BaseModel {
  constructor(opts={}) {
    super();

    this.id = opts.id;
    this.token = opts.token;
    this.username = opts.username;
    this.createdAt = opts.createdAt;
    this.updatedAt = opts.updatedAt;

    this.settings = opts.settings;

    this.bests = {};
    if (opts.bests) {
      if (opts.bests.sprint) { this.bests.sprint = new ReplayModel(opts.bests.sprint); }
      if (opts.bests.ultra) { this.bests.ultra = new ReplayModel(opts.bests.ultra); }
      if (opts.bests.survival) { this.bests.survival = new ReplayModel(opts.bests.survival); }
    }

    this.stats = {
      games: { count: 0, time: 0 },
      online: { count: 0, time: 0 },
      sprints: { count: 0, time: 0 },
      ultras: { count: 0, time: 0 },
      survivals: { count: 0, time: 0 },
    };
    if (opts.stats) {
      this.stats = opts.stats;
    }
  }

  save() {
    return Api.post('/api/v1/users/:id', {
      user: {
        username: this.username
      }
    }, { params: { id: this.id } });
  }
}
