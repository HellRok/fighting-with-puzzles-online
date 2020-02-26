import m from 'mithril';

import FlashManager from './_flash_manager';
import SidebarLink from './_sidebar_link';
import SettingsForm from './_settings_form';
import { isBigScreen } from '../lib/helpers';

import CurrentUser from '../lib/current_user';
import Api from '../lib/api';
import UserModel from '../lib/models/user_model';

export default class Nav {
  constructor() {
    this.showSidebar = isBigScreen();
    this.showSettings = false;
  }

  toggle() {
    this.showSidebar = !this.showSidebar;
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  view() {
    const _this = this;
    return [
      m('nav', [
        m('.content', [
          m(m.route.Link,
            {
              href: '/',
              class: 'logo'
            }, 'Fighting with Puzzles Online'),
          m('.icons', [
            m('.toggle-settings.icon-cog-alt',
              {
                title: this.showSettings ? 'Close the settings' : 'Open the settings',
                onclick: () => _this.toggleSettings(),
              }),
            m('.toggle-sidebar',
              {
                class: this.showSidebar ? 'icon-cancel' : 'icon-menu',
                title: this.showSidebar ? 'Close the sidebar' : 'Open the sidebar',
                onclick: () => _this.toggle(),
              }),
          ]),
        ])
      ]),
      m('.sidebar', {
        class: (this.showSidebar ? 'shown' : 'hidden'),
      }, [
        m(SidebarLink, {
          href: '/', sidebar: this,
        }, 'Home'),

          CurrentUser.data.id ? [
            m(SidebarLink, {
              href: `/users/${CurrentUser.data.id}`, sidebar: this,
            }, CurrentUser.data.username),
          ] : [
            m(SidebarLink, {
              href: `/login`, sidebar: this,
            }, 'Login'),
            m(SidebarLink, {
              href: `/register`, sidebar: this,
            }, 'Register'),
          ],

          m(SidebarLink, {
            href: '/sprint', sidebar: this,
          }, 'Sprint'),
          m(SidebarLink, {
            href: '/ultra', sidebar: this,
          }, 'Ultra'),
          m(SidebarLink, {
            href: '/leader_board', sidebar: this,
          }, 'Leader Board'),
          CurrentUser.data.id ? [
            m(m.route.Link, {
              class: 'sidebar-link',
              href: '/',
              onclick: function(e) {
                CurrentUser.logout();
                if (!isBigScreen()) { _this.toggle(); }
              }
            }, 'Logout')
          ] : '',
          m(SidebarLink, {
            href: '/how_to_play', sidebar: this,
          }, 'How to Play'),
        ]),
      m(SettingsForm,
        {
          extraClass: `
            ${this.showSidebar ? 'double' : ''}
            ${this.showSettings ? 'shown' : 'hidden'}
          `,
          nav: this,
        }
      ),
      m(FlashManager),
    ];
  }
};
