import m from 'mithril';

import Home from './components/home';
import Nav from './components/nav';
import SprintPresenter from './components/sprint_presenter';
import SprintReplayPresenter from './components/sprint_replay_presenter';
import UltraPresenter from './components/ultra_presenter';

document.addEventListener("DOMContentLoaded", () => {
  m.mount(document.querySelector('#nav'), Nav);
  m.route.prefix = '';
  m.route(document.querySelector('#app'), "/", {
    "/": Home,
    "/sprint": SprintPresenter,
    "/sprint/replay": SprintReplayPresenter,
    "/sprint/replay/:key": SprintReplayPresenter,
    "/ultra": UltraPresenter,
  })
})
