import m from 'mithril';

import CurrentUser from './lib/current_user';

import Home from './components/home';
import Nav from './components/nav';
import Login from './components/login';
import Register from './components/register';
import SprintPresenter from './components/sprint_presenter';
import SprintReplayPresenter from './components/sprint_replay_presenter';
import UltraPresenter from './components/ultra_presenter';
import UltraReplayPresenter from './components/ultra_replay_presenter';

document.addEventListener("DOMContentLoaded", () => {
  m.mount(document.querySelector('#nav'), Nav);
  m.route.prefix = '';
  m.route(document.querySelector('#app'), "/", {
    "/": Home,
    "/login": Login,
    "/register": Register,
    "/sprint": SprintPresenter,
    "/sprint/replay": SprintReplayPresenter,
    "/sprint/replay/:key": SprintReplayPresenter,
    "/ultra": UltraPresenter,
    "/ultra/replay": UltraReplayPresenter,
    "/ultra/replay/:key": UltraReplayPresenter,
  })

  CurrentUser.initFromToken();
})
