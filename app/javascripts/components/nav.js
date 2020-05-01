import m from 'mithril';

import FlashManager from './_flash_manager';
import SidebarLink from './_sidebar_link';
import SettingsForm from './_settings_form';
import { isBigScreen } from '../lib/helpers';

import CurrentUser from '../lib/current_user';
import Api from '../lib/api';
import UserModel from '../lib/models/user_model';

const Nav = {
  showSidebar: isBigScreen(),
  showSettings: false,

  toggle: function() {
    this.showSidebar = !this.showSidebar;
  },

  toggleSettings: function() {
    this.showSettings = !this.showSettings;
  },

  view() {
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
                title: Nav.showSettings ? 'Close the settings' : 'Open the settings',
                onclick: () => Nav.toggleSettings(),
              }),
            m('.toggle-sidebar',
              {
                class: Nav.showSidebar ? 'icon-cancel' : 'icon-menu',
                title: Nav.showSidebar ? 'Close the sidebar' : 'Open the sidebar',
                onclick: () => Nav.toggle(),
              }),
          ]),
        ])
      ]),
      m('.sidebar', {
        class: (Nav.showSidebar ? 'shown' : 'hidden'),
      }, [
        m(SidebarLink, { href: '/', }, 'Home'),

          CurrentUser.data.id ? [
            m(SidebarLink, { href: `/profile/${CurrentUser.data.id}`, }, CurrentUser.data.username),
          ] : [
            m(SidebarLink, { href: '/login', }, 'Login'),
            m(SidebarLink, { href: '/register', }, 'Register'),
          ],

          m(SidebarLink, { href: '/sprint', }, 'Sprint'),
          m(SidebarLink, { href: '/ultra', }, 'Ultra'),
          m(SidebarLink, { href: '/survival', }, 'Survival'),
          m(SidebarLink, { href: '/online', }, 'Online (Alpha)'),
          m(SidebarLink, { href: '/leader_board', }, 'Leader Board'),

          CurrentUser.data.id ? [
            m(m.route.Link, {
              class: 'sidebar-link',
              href: '/',
              onclick: function(e) {
                CurrentUser.logout();
                if (!isBigScreen()) { Nav.toggle(); }
              }
            }, 'Logout')
          ] : '',
          m(SidebarLink, { href: '/how_to_play', }, 'How to Play'),
        ]),
      m(SettingsForm,
        {
          extraClass: `
            ${Nav.showSidebar ? 'double' : ''}
            ${Nav.showSettings ? 'shown' : 'hidden'}
          `,
        }
      ),
      m(FlashManager),
    ];
  }
};

export default Nav;
