import m from 'mithril';

import Api from '../lib/api';
import CurrentUser from '../lib/current_user';

export default class Login {
  constructor() {
    this.submitting = false;
    this.errors = {};
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
      } else {
        this.errors = response.errors
      }
    });
  }

  view() {
    return [
      m('h2.text-centre', 'Login'),
      m('form.login', {
        onsubmit: e => { this.onsubmit(e) }
      }, [
        m('fieldset', [
          m('label', { for: 'username' }, 'Username'),
          m('input', { id: 'username', for: 'username' }, 'Username'),

          m('label', { for: 'password' }, 'Password'),
          m('input', { id: 'password', for: 'password', type: 'password' }, 'Password'),

          this.errors.session ? m('.general-error', this.errors.session) : '',

          m('input.width-100', { type: 'submit', disabled: this.submitting })
        ])
      ])
    ];
  }
}

