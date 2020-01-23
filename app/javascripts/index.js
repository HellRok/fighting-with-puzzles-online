import m from 'mithril';

import Home from './components/home';
import Nav from './components/nav';
import Sprint from './components/sprint';
import Ultra from './components/ultra';

document.addEventListener("DOMContentLoaded", () => {
  m.mount(document.querySelector('#nav'), Nav);
  m.route.prefix = '';
  m.route(document.querySelector('#app'), "/", {
    "/": Home,
    "/sprint": Sprint,
    "/ultra": Ultra,
  })
})
