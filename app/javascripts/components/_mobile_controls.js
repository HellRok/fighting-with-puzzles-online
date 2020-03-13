import m from 'mithril';

import Settings from '../lib/settings';

export default {
  positions: {
    left:     { bottom:  "75px",  left:  "10px" },
    right:    { bottom:  "75px",  left: "140px" },
    hardDrop: { bottom:  "120px", left:  "75px" },
    softDrop: { bottom:  "30px",  left:  "75px" },
    cw:       { bottom:  "75px",  right: "10px" },
    ccw:      { bottom:  "30px",  right: "75px" },
    switch:   { bottom: "120px",  right: "75px" },
    restart:  { top:     "50px",  left:  "10px" },
  },

  press: function(e) {
    e.preventDefault();
    const event = new KeyboardEvent('keydown', { keyCode : Settings.keys[e.currentTarget.dataset.key] });
    document.dispatchEvent(event);
  },

  release: function(e) {
    e.preventDefault();
    const event = new KeyboardEvent('keyup', { keyCode : Settings.keys[e.currentTarget.dataset.key] });
    document.dispatchEvent(event);
  },

  key: function(input, icon=input) {
    return m(`.mobile-input.${icon}`,
      {
        'data-key':    input,
        onmousedown:   this.press,
        onmouseup:     this.release,
        ontouchstart:  this.press,
        ontouchcancel: this.release,
        ontouchend:    this.release,
        style: this.positions[input],
      },
      m(`.icon-${icon}`)
    );
  },

  view: function() {
    return Settings.site.displayMobileControls ? m('.mobile-controls', [
      this.key('left'),
      this.key('right'),
      this.key('hardDrop', 'hard-drop'),
      this.key('softDrop', 'soft-drop'),
      this.key('cw'),
      this.key('ccw'),
      this.key('switch'),
      this.key('restart'),
    ]) : '';
  }
};
