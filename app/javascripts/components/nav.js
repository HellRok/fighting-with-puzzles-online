import m from 'mithril';

import SidebarLink from './_sidebar_link';
import SettingsForm from './_settings_form';
import { isBigScreen } from '../lib/helpers';

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
          m(SidebarLink, {
            href: '/sprint', sidebar: this,
          }, 'Sprint'),
          m(SidebarLink, {
            href: '/ultra', sidebar: this,
          }, 'Ultra'),
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
    ];
  }
};
