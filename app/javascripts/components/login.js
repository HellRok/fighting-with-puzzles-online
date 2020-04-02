import m from 'mithril';

import Layout from './layout';

import Api from '../lib/api';
import CurrentUser from '../lib/current_user';
import Flash from '../lib/flash';

export default class Login {
  constructor() {
    this.submitting = false;
  }

  onsubmit(e) {
    e.preventDefault();
    this.submitting = true;
    const form = e.target;

    Api.sessionsCreate({
      username: form.username.value,
      password: form.password.value,
    }).then(response => {
      this.submitting = false;

      if (response.success) {
        CurrentUser.setUser(response.data);
        m.route.set('/');
        Flash.addFlash({
          text: `Logged in as ${CurrentUser.data.username}`,
          level: 'success',
          timeout: 5000,
        });
      } else {
        Flash.addFlash({
          text: response.errors.session,
          level: 'warning',
          timeout: 5000,
        });
      }
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', 'Login'),
      m('form.login', {
        onsubmit: e => { this.onsubmit(e) }
      }, [
        m('fieldset', [
          m('label', { for: 'username' }, 'Username'),
          m('input', { id: 'username', for: 'username' }, 'Username'),

          m('label', { for: 'password' }, 'Password'),
          m('input', { id: 'password', for: 'password', type: 'password' }, 'Password'),

          m('input.width-100', { type: 'submit', disabled: this.submitting, value: 'Submit' })
        ])
      ])
    ]);
  }
}

