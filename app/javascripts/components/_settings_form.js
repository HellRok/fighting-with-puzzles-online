import m from 'mithril';

import Nav from './nav';
import Settings from '../lib/settings';
import Audio from '../lib/audio';
import { keyboardMap } from '../lib/helpers';

export default class SettingsForm {
  constructor() {
    this.resetUnsaved();
  }

  save() {
    this.unsaved.game.volume = document.querySelector('.settings-form #volume').value;
    this.unsaved.game.das = document.querySelector('.settings-form #das').value;
    this.unsaved.game.arr = document.querySelector('.settings-form #arr').value;
    this.unsaved.site.displayMobileControls = document.querySelector('.settings-form #displayMobileControls').checked ? 1 : 0;
    Settings.save(this.unsaved);
    this.resetUnsaved();
    Audio.setVolume(Settings.game.volume);
    m.redraw();
  }

  resetUnsaved() {
    this.unsaved = { site: {}, keys: {}, game: {} };
  }

  valueFor(group, key) {
    return this.unsaved[group][key] || Settings[group][key];
  }

  resetDefaults() {
    if (confirm("This  will wipe all your settings, are you sure?")) {
      Settings.resetDefaults();
      this.resetUnsaved();
      Nav.showSettings = false;
      m.redraw();
    }
  }

  oncreate() {
    const _this = this;
    document.querySelectorAll('.settings-form .key').forEach(elem => {
      elem.addEventListener('keydown', (event) => {
        event.preventDefault() 
        const target = event.target;
        _this.unsaved[target.dataset.group][target.dataset.setting] = event.keyCode;
        target.value = keyboardMap[event.keyCode];
      });
    });
  }

  view(vnode) {
    const _this = this;

    return [
      m('.settings-form',
        {
          class: vnode.attrs.extraClass
        },
        [
          m('.header', [
            m('button.button-outline', { onclick: (e) => {
              e.preventDefault();
              _this.resetUnsaved();
              Nav.showSettings = false;
            } }, 'Close'),
            m('button', { onclick: (e) => {
              e.preventDefault();
              _this.save();
              Nav.showSettings = false;
            } }, 'Save'),
          ]),

          m('.fieldset', [
            m('h2', 'Game'),

            m('label', { for: 'volume' }, 'Volume %'),
            m('input#volume.game', {
              type: 'number',
              min: 0,
              max: 100,
              step: 1,
              'data-group': 'game',
              'data-setting': 'volume',
              value: this.valueFor('game', 'volume'),
            }),

            m('label', { for: 'displayMobileControls' }, 'Use Mobile Controls'),
            m('input#displayMobileControls.', {
              type: 'checkbox',
              checked: this.valueFor('site', 'displayMobileControls'),
              'data-group': 'site',
              'data-setting': 'displayMobileControls',
              value: 1,
            }),

            m('label', { for: 'das' }, 'Delayed Auto-Shift (DAS)'),
            m('input#das.game', {
              type: 'text',
              'data-group': 'game',
              'data-setting': 'das',
              value: this.valueFor('game', 'das'),
            }),

            m('label', { for: 'arr' }, 'Auto-Repeat Rate (ARR)'),
            m('input#arr.game', {
              type: 'text',
              'data-group': 'game',
              'data-setting': 'arr',
              value: this.valueFor('game', 'arr'),
            }),

            m('h2', 'Controls'),

            m('label', { for: 'restart' }, 'Start/Restart'),
            m('input#restart.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'restart',
              value: keyboardMap[this.valueFor('keys', 'restart')],
            }),

            m('label', { for: 'left' }, 'Move Left'),
            m('input#left.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'left',
              value: keyboardMap[this.valueFor('keys', 'left')],
            }),

            m('label', { for: 'right' }, 'Move Right'),
            m('input#right.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'right',
              value: keyboardMap[this.valueFor('keys', 'right')],
            }),

            m('label', { for: 'hardDrop' }, 'Hard Drop'),
            m('input#hardDrop.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'hardDrop',
              value: keyboardMap[this.valueFor('keys', 'hardDrop')],
            }),

            m('label', { for: 'softDrop' }, 'Soft Drop'),
            m('input#softDrop.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'softDrop',
              value: keyboardMap[this.valueFor('keys', 'softDrop')],
            }),

            m('label', { for: 'cw' }, 'Rotate Clockwise'),
            m('input#cw.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'cw',
              value: keyboardMap[this.valueFor('keys', 'cw')],
            }),

            m('label', { for: 'ccw' }, 'Rotate Counter-Clockwise'),
            m('input#ccw.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'ccw',
              value: keyboardMap[this.valueFor('keys', 'ccw')],
            }),

            m('label', { for: 'switch' }, 'Switch Pieces'),
            m('input#switch.key', {
              type: 'text',
              'data-group': 'keys',
              'data-setting': 'switch',
              value: keyboardMap[this.valueFor('keys', 'switch')],
            }),

            m('.button.warning.width-100', { onclick: () => _this.resetDefaults() }, 'Reset Defaults'),
          ]),
        ]),
    ];
  }
}
