import m from 'mithril';

import Home from './components/home';

document.addEventListener("DOMContentLoaded", () => {
  m.route.prefix = '';
  m.route(document.querySelector('#app'), "/", {
    "/": Home,
  })
})
