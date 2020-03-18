import m from 'mithril';

import CurrentUser from './lib/current_user';

import Home from './components/home';
import Nav from './components/nav';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/profile';

import SprintPresenter from './components/sprint_presenter';
import SprintReplayPresenter from './components/sprint_replay_presenter';

import UltraPresenter from './components/ultra_presenter';
import UltraReplayPresenter from './components/ultra_replay_presenter';

import SurvivalPresenter from './components/survival_presenter';
import SurvivalReplayPresenter from './components/survival_replay_presenter';

import OnlinePresenter from './components/online_presenter';

import LeaderBoard from './components/leader_board';

import HowToPlay from './components/how_to_play';

document.addEventListener("DOMContentLoaded", () => {
  m.mount(document.querySelector('#nav'), Nav);
  m.route.prefix = '';

  m.route(document.querySelector('#app'), "/", {
    "/": Home,
    "/login": Login,
    "/register": Register,
    "/profile/:key": Profile,

    "/sprint": SprintPresenter,
    "/sprint/replay/:key": SprintReplayPresenter,
    "/ultra": UltraPresenter,
    "/ultra/replay/:key": UltraReplayPresenter,
    "/survival": SurvivalPresenter,
    "/survival/replay/:key": SurvivalReplayPresenter,
    "/online": OnlinePresenter,

    "/leader_board": LeaderBoard,
    "/how_to_play": HowToPlay,
  });

  CurrentUser.initFromToken();
  const socket = new WebSocket('ws://localhost:9001/game/1');
  socket.addEventListener('message', (e) => {
    console.log(e);
    socket.send(`RESPONDING AS ${CurrentUser.data.username}`)
  });
  socket.addEventListener('open', (e) => { socket.send(`CONNECTING AS ${CurrentUser.data.username}`) });
});
