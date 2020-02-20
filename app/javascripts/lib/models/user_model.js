import Api from '../api';
import BaseModel from './base_model';

export default class UserModel extends BaseModel {
  constructor(opts) {
    super();

    this.id = opts.id;
    this.token = opts.token;
    this.username = opts.username;
    this.createdAt = opts.createdAt;
    this.updatedAt = opts.updatedAt;
  }

  save() {
    return Api.post('/api/v1/users/:id', {
      user: {
        username: this.username
      }
    }, { params: { id: this.id } });
  }
}
