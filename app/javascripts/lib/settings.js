import { isBigScreen } from './helpers';

function valueOrDefault(value, defaultValue) {
  const storedValue = localStorage.getItem(value);
  if (storedValue === null) { return defaultValue; }
  return parseInt(storedValue);
};

export default {
  debug: valueOrDefault('debug', 0),

  site: {
    beenHereBefore: valueOrDefault('site.beenHereBefore', 0),
    displayMobileControls: valueOrDefault('site.displayMobileControls', isBigScreen() ? 0 : 1),
  },

  keys: {
    restart:  valueOrDefault('keys.restart',  113),
    left:     valueOrDefault('keys.left',      37),
    right:    valueOrDefault('keys.right',     39),
    hardDrop: valueOrDefault('keys.hardDrop',  38),
    softDrop: valueOrDefault('keys.softDrop',  40),
    ccw:      valueOrDefault('keys.ccw',       88),
    cw:       valueOrDefault('keys.cw',        67),
    switch:   valueOrDefault('keys.switch',    90),
  },

  game: {
    volume: valueOrDefault('game.volume', 70),
    das:    valueOrDefault('game.das',   183),
    arr:    valueOrDefault('game.arr',    33),
  },

  save: function(toSave) {
    this.site.displayMobileControls = toSave.site.displayMobileControls;
    this.keys = { ...toSave.keys };
    this.game = { ...toSave.game };

    localStorage.setItem('site.displayMobileControls', this.site.displayMobileControls);
    localStorage.setItem('keys.restart',               this.keys.restart);
    localStorage.setItem('keys.left',                  this.keys.left);
    localStorage.setItem('keys.right',                 this.keys.right);
    localStorage.setItem('keys.hardDrop',              this.keys.hardDrop);
    localStorage.setItem('keys.softDrop',              this.keys.softDrop);
    localStorage.setItem('keys.ccw',                   this.keys.ccw);
    localStorage.setItem('keys.cw',                    this.keys.cw);
    localStorage.setItem('keys.switch',                this.keys.switch);
    localStorage.setItem('game.volume',                this.game.volume);
    localStorage.setItem('game.das',                   this.game.das);
    localStorage.setItem('game.arr',                   this.game.arr);
  },

  beenHereNow: function() {
    this.site.beenHereBefore = 1;
    localStorage.setItem('site.beenHereBefore', 1);
  },

  resetDefaults: function() {
    localStorage.removeItem('site.displayMobileControls');
    localStorage.removeItem('keys.restart');
    localStorage.removeItem('keys.left');
    localStorage.removeItem('keys.right');
    localStorage.removeItem('keys.hardDrop');
    localStorage.removeItem('keys.softDrop');
    localStorage.removeItem('keys.ccw');
    localStorage.removeItem('keys.cw');
    localStorage.removeItem('keys.switch');
    localStorage.removeItem('game.volume');
    localStorage.removeItem('game.das');
    localStorage.removeItem('game.arr');
  },
};
