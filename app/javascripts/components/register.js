import m from 'mithril';

import Layout from './layout';

import Api from '../lib/api';
import CurrentUser from '../lib/current_user';
import Flash from '../lib/flash';

export default class Register {
  constructor() {
    this.submitting = false;
    this.errors = {};
  }

  errorsFor(field) {
    return this.errors[field] || [];
  }

  onsubmit(e) {
    e.preventDefault();
    this.submitting = true;
    const form = e.target;

    Api.usersCreate({
      username: form.username.value,
      password: form.password.value,
      password_confirmation: form.passwordConfirmation.value,
    }).then(response => {
      this.submitting = false;
      if (response.success) {
        CurrentUser.setUser(response.data);
        m.route.set('/');
        Flash.addFlash({
          text: `Welcome ${CurrentUser.data.username}!`,
          level: 'success',
          timeout: 5000,
        });
      } else {
        this.errors = response.errors
      }
    });
  }

  view() {
    return m(Layout, [
      m('h2.text-centre', 'Register'),
      m('form.registration', {
        onsubmit: e => { this.onsubmit(e) }
      }, [
        m('fieldset', {
          class: this.errorsFor('username').length > 0 ? 'error' : '',
        }, [
          m('label', { for: 'username' }, 'Username'),
          m('input', { id: 'username', for: 'username' }, 'Username'),
          this.errorsFor('username').map(error => m('.error-text', error)),
        ]),

        m('fieldset', {
          class: this.errorsFor('password').length > 0 ? 'error' : '',
        }, [
          m('label', { for: 'password' }, 'Password'),
          m('input', { id: 'password', for: 'password', type: 'password' }, 'Password'),
          this.errorsFor('password').map(error => m('.error-text', error)),
        ]),

        m('fieldset', {
          class: this.errorsFor('password_confirmation').length > 0 ? 'error' : '',
        }, [
          m('label', { for: 'passwordConfirmation' }, 'Password Confirmation'),
          m('input', { id: 'passwordConfirmation', for: 'passwordConfirmation', type: 'password'}, 'Password Confirmation'),
          this.errorsFor('password_confirmation').map(error => m('.error-text', error)),
        ]),

        m('input.width-100', { type: 'submit', disabled: this.submitting })
      ])
    ]);
  }
}
