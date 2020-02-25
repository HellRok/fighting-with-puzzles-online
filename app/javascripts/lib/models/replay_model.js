import kissc from '../../vendor/kissc';

import Api from '../api';
import BaseModel from './base_model';

export default class ReplayModel extends BaseModel {
  constructor(opts) {
    super();

    this.id = opts.id;
    this.time = opts.time;
    this.score = opts.score;
    this.mode = opts.mode;
    this.version = opts.version;
    this.createdAt = opts.createdAt;
    this.user = opts.user;
    this.data = opts.data;
  }

  parsedData() {
    return JSON.parse(kissc.decompress(this.data));
  }

  save() {
    return Api.post('/api/v1/users/:id', {
      user: {
        username: this.username
      }
    }, { params: { id: this.id } });
  }
}

