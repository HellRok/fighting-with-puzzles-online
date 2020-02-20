import m from 'mithril';

import CurrentUser from './current_user';
import UserModel from './models/user_model';

export default {
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

  headers: function() {
    if (CurrentUser.token === undefined) { return {}; }

    return {
      'Authorization': `Token ${CurrentUser.token}`,
    };
  },
}
