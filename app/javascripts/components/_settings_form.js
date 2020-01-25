import m from 'mithril';

import Settings from '../lib/settings';
import { keyboardMap } from '../lib/helpers';

export default class SettingsForm {
  constructor() {
    this.unsaved = {};
    this.unsaved.keys = { ...Settings.keys };
    this.unsaved.game = { ...Settings.game };
  }

  save() {
    this.unsaved.game.das = document.querySelector('.settings-form #das').value;
    this.unsaved.game.arr = document.querySelector('.settings-form #arr').value;
    Settings.save(this.unsaved);
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

  view() {
    const _this = this;

    return [
      m('fieldset.settings-form', [
        m('h2', 'Game'),
        m('label', { for: 'das' }, 'Delayed Auto-Shift (DAS)'),
        m('input#das.game', {
          type: 'text',
          'data-group': 'game',
          'data-setting': 'das',
          value: this.unsaved.game.das,
        }),
        m('label', { for: 'arr' }, 'Auto Repeat Rate (ARR)'),
        m('input#arr.game', {
          type: 'text',
          'data-group': 'game',
          'data-setting': 'arr',
          value: this.unsaved.game.arr,
        }),
        m('h2', 'Controls'),
        m('label', { for: 'restart' }, 'Start/Restart'),
        m('input#restart.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'restart',
          value: keyboardMap[this.unsaved.keys.restart],
        }),
        m('label', { for: 'left' }, 'Move Left'),
        m('input#left.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'left',
          value: keyboardMap[this.unsaved.keys.left],
        }),
        m('label', { for: 'right' }, 'Move Right'),
        m('input#right.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'right',
          value: keyboardMap[this.unsaved.keys.right],
        }),
        m('label', { for: 'hardDrop' }, 'Hard Drop'),
        m('input#hardDrop.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'hardDrop',
          value: keyboardMap[this.unsaved.keys.hardDrop],
        }),
        m('label', { for: 'softDrop' }, 'Soft Drop'),
        m('input#softDrop.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'softDrop',
          value: keyboardMap[this.unsaved.keys.softDrop],
        }),
        m('label', { for: 'cw' }, 'Rotate Clockwise'),
        m('input#cw.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'cw',
          value: keyboardMap[this.unsaved.keys.cw],
        }),
        m('label', { for: 'ccw' }, 'Rotate Counter-Clockwise'),
        m('input#ccw.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'ccw',
          value: keyboardMap[this.unsaved.keys.ccw],
        }),
        m('label', { for: 'switch' }, 'Switch Pieces'),
        m('input#switch.key', {
          type: 'text',
          'data-group': 'keys',
          'data-setting': 'switch',
          value: keyboardMap[this.unsaved.keys.switch],
        }),
      ]),
      m('button', { onclick: (e) => { e.preventDefault(); _this.save() } }, 'Save'),
    ];
  }
}
