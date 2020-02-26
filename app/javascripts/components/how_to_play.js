import m from 'mithril';

import Layout from './layout';

import Settings from '../lib/settings';
import { keyboardMap } from '../lib/helpers';

export default {
  view: () => {
    return m(Layout, [
      m('.how-to-play.max-width-960', [
        m('h2', 'How to Play'),

        m('h3', 'Contents'),
        m('ol', [
          m('li', m('a', { href: '#controls' }, 'Controls'),
            m('ol', [
              m('li', m('a', { href: '#controls-movement' }, 'Movement')),
              m('li', m('a', { href: '#controls-rotation' }, 'Rotation')),
            ]),
          ),
          m('li', m('a', { href: '#gameplay' }, 'Gameplay'),
            m('ol', [
              m('li', m('a', { href: '#gameplay-gems' }, 'Gems')),
              m('li', m('a', { href: '#gameplay-clusters' }, 'Clusters')),
              m('li', m('a', { href: '#gameplay-chains' }, 'Chains')),
              m('li', m('a', { href: '#gameplay-modes' }, 'Modes')),
            ]),
          ),

        ]),

        m('h3#controls', 'Controls'),

        m('h4#controls-movement', 'Movement'),
        m('p', [
          m('.key', keyboardMap[Settings.keys.left]), 'to move the active piece left', m('br'),
          m('.key', keyboardMap[Settings.keys.right]), 'to move the active piece right', m('br'),
          m('.key', keyboardMap[Settings.keys.softDrop]), 'to speed up the gravity', m('br'),
          m('.key', keyboardMap[Settings.keys.hardDrop]), 'to drop the piece and lock it immediately', m('br'),
        ]),

        m('h4#controls-rotation', 'Rotation'),
        m('p', [
          m('.key', keyboardMap[Settings.keys.cw]), 'to rotate the piece clockwise (right)', m('br'),
          m('.key', keyboardMap[Settings.keys.ccw]), 'to rotate the piece counter-clockwise (left)', m('br'),
          m('.key', keyboardMap[Settings.keys.switch]), 'to switch the gems in the active piece', m('br'),
        ]),

        m('h3#gameplay', 'Gameplay'),

        m('h4#gameplay-gems', 'Gems'),
        m('p', `This is the basic block of the game, you place two of these at
          a time. There are 4 colours and a special "smasher" type of each
          colour. When a smasher is placed on a gem of the same colour it will
          smash all of the attached matching gems giving you points. Each gem
          will give you 100 points, including the smasher.`),
        m('table', [
          m('thead',
            m('tr', [m('td', 'Colour'), m('td', 'Normal'), m('td', 'Smasher')])
          ),
          m('tbody', [
            m('tr', [m('td', 'Red'),    m('td', m('.gem.red')),    m('td', m('.gem.red.smasher'))]),
            m('tr', [m('td', 'Blue'),   m('td', m('.gem.blue')),   m('td', m('.gem.blue.smasher'))]),
            m('tr', [m('td', 'Orange'), m('td', m('.gem.orange')), m('td', m('.gem.orange.smasher'))]),
            m('tr', [m('td', 'Purple'), m('td', m('.gem.purple')), m('td', m('.gem.purple.smasher'))]),
          ])
        ]),

        m('h4#gameplay-clusters', 'Clusters'),
        m('p', `A cluster occurs when you make a rectangle of a solid colour,
          this can only be as small as 2x2.`),
        m('.board-example', [
          m('div', [
            m('.gem.blue.cluster.top-left'),
            m('.gem.blue.cluster.top-right'),
          ]),
          m('div', [
            m('.gem.blue.cluster.bottom-left'),
            m('.gem.blue.cluster.bottom-right')
          ]),
        ]),
        m('p', `These are generated before the smashing takes place, so you can user a smasher gem to create a cluster like this.`),
        m('.board-example', [
          m('div', [
            m('.gem.orange.cluster.top-left'),
            m('.gem.orange.cluster.top'),
            m('.gem.orange.smasher'),
          ]),
          m('div', [
            m('.gem.orange.cluster.bottom-left'),
            m('.gem.orange.cluster.bottom'),
            m('.gem.orange.cluster.bottom-right')
          ]),
        ]),
        m('p', `Scoring for clusters is fairly straight forward, gems are worth
          twice as much, so each gem is worth 200 points. Although, if you
          create a square cluster each gem will be worth 250. So a 2x2 cluster
          is worth 1000, but a 2x3 is worth 1200 so it's always worth it to go
          for the squares if you can!`),

        m('h4#gameplay-chains', 'Chains'),
        m('p', `A chain is when after smashing the gems, the resulting board
          would trigger more smashing. For instance the belowe would be a two
          chain. This is because the oranges would clear, leaving the purple
          smasher on top of the purple gems, meaning there is more smashing to
          do.`),

        m('.board-example', [
          m('div', [
            m('.gem.purple.smasher'),
          ]),
          m('div', [
            m('.gem.orange.smasher'),
          ]),
          m('div', [
            m('.gem.orange'),
            m('.gem.orange'),
          ]),
          m('div', [
            m('.gem.purple'),
            m('.gem.purple'),
            m('.gem.purple'),
          ]),
        ]),

        m('p', 'becomes'),
        m('.board-example', [
          m('div', [
            m('.gem.purple.smasher'),
          ]),
          m('div', [
            m('.gem.purple'),
            m('.gem.purple'),
            m('.gem.purple'),
          ]),
        ]),
        m('p', 'Then it would be all clear.'),
        m('p', `Scoring with chains is a little more complicated than clusters
          because it's a growing multpilier. Every link in the chain adds 0.5 to
          the multiplier, so 1 chain is 1x, 2 chain is 1.5x, 3 chain is 2x, etc. In
          the above example the score would be 100 x 3 x 1 for the orange gems
          and 100 x 4 x 1.5 for the purple gems for a total of 900.`),

        m('h4#gameplay-modes', 'Modes'),
        m('p', [
          'There are currently two modes:', m('br'),
          m('strong', 'Sprint:'), ' Clear 140 gems as quickly as you can, speed is the only thing that matters here.', m('br'),
          m('strong', 'Ultra:'), ' You have 3 minutes to score as high as possible, use clusters and chains to maximise your scoring.',
        ]),
      ]),
    ]);
  }
};
