import Api from '../api';
import BaseModel from './base_model';

export default class RoomModel extends BaseModel {
  constructor(opts) {
    super();

    this.id = opts.id;
    this.name = opts.name;
    this.gameServerUrl = opts.gameServerUrl;
    this.players = [];
    this.settings = opts.settings;
    this.createdAt = opts.createdAt;
    this.updatedAt = opts.updatedAt;
  }

  save() {
    return Api.post('/api/v1/rooms/:id', {
      rooms: {
        name: this.name,
        settings: this.settings,
      }
    }, { params: { id: this.id } });
  }
};
