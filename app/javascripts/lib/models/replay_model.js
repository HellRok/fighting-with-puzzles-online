import Api from '../api';
import BaseModel from './base_model';

export default class ReplayModel extends BaseModel {
  constructor(opts) {
    super();

    this.id = opts.id;
    this.time = opts.time;
    this.score = opts.score;
    this.mode = opts.mode;
    this.createdAt = opts.createdAt;
    this.user = opts.user;
    this.data = opts.data;
  }

  save() {
    return Api.post('/api/v1/users/:id', {
      user: {
        username: this.username
      }
    }, { params: { id: this.id } });
  }
}

