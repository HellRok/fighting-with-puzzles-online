import m from 'mithril';
import { isEmpty } from 'lodash/lang';

import Api from './api';
import Settings from './settings';
import UserModel from './models/user_model';

export default {
  token: localStorage.getItem('sessionToken'),
  data: {},
  settings: { keys: {}, game: {} },

  isPresent() { return this.token && !isEmpty(this.data); },

  initFromToken() {
    if (this.token && isEmpty(this.data)) {
      this.refresh();
    }
  },

  logout() {
    localStorage.removeItem('sessionToken');
    this.token = undefined;
    this.data = {};
    this.settings = { keys: {}, game: {} };
    Settings.resetDefaults();
    m.redraw();
  },

  login(username, password) {
    return Api.post(
      '/api/v1/sessions',
      {
        session: {
          username: username,
          password: password,
        }
      },
    ).then(response => {
      if (response.success) {
        this.setUser(new UserModel(response.data));
      } else {
        return response.errors;
      }
    });
  },

  setUser(user) {
    this.data = user;
    this.token = user.token;
    this.settings = user.settings;
    Settings.populateFrom(this.settings);
    localStorage.setItem('sessionToken', user.token);
  },

  refresh() {
    Api.sessionCurrent().then(response => {
      if (response.success) {
        this.setUser(response.data);
      }
    });
  },

  update(data) {
    Api.sessionUpdate({ user: data }).then(response => {
      if (response.success) {
        this.setUser(response.data);
      }
    });
  },
}
