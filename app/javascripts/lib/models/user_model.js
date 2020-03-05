import Api from '../api';
import BaseModel from './base_model';
import ReplayModel from './replay_model';

export default class UserModel extends BaseModel {
  constructor(opts) {
    super();

    this.id = opts.id;
    this.token = opts.token;
    this.username = opts.username;
    this.createdAt = opts.createdAt;
    this.updatedAt = opts.updatedAt;
    this.bests = {};
    if (opts.bests.sprint) { this.bests.sprint = new ReplayModel(opts.bests.sprint); }
    if (opts.bests.ultra) { this.bests.ultra = new ReplayModel(opts.bests.ultra); }
    if (opts.bests.survival) { this.bests.survival = new ReplayModel(opts.bests.survival); }
  }

  save() {
    return Api.post('/api/v1/users/:id', {
      user: {
        username: this.username
      }
    }, { params: { id: this.id } });
  }
}
