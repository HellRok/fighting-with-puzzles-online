import m from 'mithril';

import CurrentUser from './current_user';
import UserModel from './models/user_model';
import ReplayModel from './models/replay_model';
import RoomModel from './models/room_model';

export default {
  // Room
  roomsAll: function() {
    return this.loadAll('/api/v1/rooms', RoomModel);
  },

  roomsCreate: function(data) {
    return this.create('/api/v1/rooms', { room: data }, RoomModel);
  },

  roomsFind: function(id) {
    return this.load('/api/v1/rooms/:id', id, RoomModel);
  },

  // Replay
  replaysLeaderboard: function() {
    return this.get('/api/v1/replays/leader_board').then((response) => {
      if (response.success) {
        return this.replaysByMode(response.data);
      } else {
        return response;
      }
    });
  },

  replaysAll: function() {
    return this.loadAll('/api/v1/replays', ReplayModel);
  },

  replaysFind: function(id) {
    return this.load('/api/v1/replays/:id', id, ReplayModel);
  },

  replaysFindBattle: function(gpm) {
    return this.get(`/api/v1/replays/battle`, { params: { gpm: gpm } }).then((response) => {
      if (response.success) {
        return new ReplayModel(response.data);
      } else {
        return response;
      }
    });
  },

  replaysForUser: function(userId) {
    return this.get('/api/v1/users/:id/replays/leader_board', { params: { id: userId } }).then((response) => {
      if (response.success) {
        return this.replaysByMode(response.data);
      } else {
        return response;
      }
    });
  },

  replaysCreate: function(data) {
    return this.create('/api/v1/replays', { replay: data }, ReplayModel);
  },

  // User
  usersAll: function() {
    return this.loadAll('/api/v1/users', UserModel);
  },

  usersFind: function(id) {
    return this.load('/api/v1/users/:id', id, UserModel);
  },

  usersCreate: function(data) {
    return this.create('/api/v1/users', { user: data }, UserModel);
  },

  // Session
  sessionCurrent: function() {
    return this.get('/api/v1/sessions').then(response => {
      if (response.success) {
        return { success: true, data: new UserModel(response.data) };
      } else {
        return response;
      }
    })
  },

  sessionsCreate: function(data) {
    return this.create('/api/v1/sessions', { session: data }, UserModel);
  },

  sessionUpdate: function(data) {
    return this.update('/api/v1/sessions', data, UserModel).then(response => {
      return response;
    });
  },

  // Generic
  loadAll: function(url, klass) {
    return this.get(url).then((response) => {
      if (response.success) {
        return response.data.map(user => (new klass(user)));
      } else {
        return response;
      }
    });
  },

  load: function(url, id, klass) {
    return this.get(url, { params: { id: id } }).then((response) => {
      if (response.success) {
        return new klass(response.data);
      } else {
        return response;
      }
    });
  },

  create: function(url, data, klass) {
    return this.post(url, data).then(response => {
      if (response.success) {
        return { success: true, data: new klass(response.data) };
      } else {
        return response;
      }
    });
  },

  update: function(url, data, klass) {
    return this.patch(url, data).then(response => {
      if (response.success) {
        return { success: true, data: new klass(response.data) };
      } else {
        return response;
      }
    });
  },

  get: function(url, opts={}) {
    return m.request({
      ...{
        url: url,
        headers: this.headers(),
      },
      ...opts,
    });
  },

  post: function(url, body, opts={}) {
    return m.request({
      ...{
        method: 'POST',
        url: url,
        headers: this.headers(),
        body: body,
      },
      ...opts,
    });
  },

  patch: function(url, body, opts={}) {
    return m.request({
      ...{
        method: 'PATCH',
        url: url,
        headers: this.headers(),
        body: body,
      },
      ...opts,
    });
  },


  headers: function() {
    if (CurrentUser.token === undefined) { return {}; }

    return {
      'Authorization': `Token ${CurrentUser.token}`,
    };
  },

  // Specific but shared
  replaysByMode: function(replays) {
    return {
      sprints: replays.sprints.map(replay => (new ReplayModel(replay))),
      ultras: replays.ultras.map(replay => (new ReplayModel(replay))),
      survivals: replays.survivals.map(replay => (new ReplayModel(replay))),
      battlers: replays.battlers,
    };
  },
}
