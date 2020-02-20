import { isEmpty } from 'lodash/lang';

import Api from './api';
import UserModel from './models/user_model';

export default {
  token: localStorage.getItem('sessionToken'),
  data: {},

  isPresent() { return this.token && !isEmpty(this.data); },

  initFromToken: function() {
    if (this.token && isEmpty(this.data)) {
      this.refresh();
    }
  },

  logout() {
    localStorage.removeItem('sessionToken');
    this.token = undefined;
    this.data = {};
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

  setUser: function(user) {
    this.data = user;
    this.token = user.token;
    localStorage.setItem('sessionToken', user.token);
  },

  refresh: function() {
    Api.sessionCurrent().then(response => {
      if (response.success) {
        this.setUser(response.data);
      }
    });
  },
}
