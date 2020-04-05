import CurrentUser from './current_user';
import { isBigScreen } from './helpers';

function valueOrDefault(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) { return defaultValue; }
  return parseInt(storedValue);
};

export default {
  debug: valueOrDefault('debug', 0),

  site: {
    beenHereBefore:        valueOrDefault('site.beenHereBefore',        0),
    displayMobileControls: valueOrDefault('site.displayMobileControls', isBigScreen() ? 0 : 1),
    lightMode:             valueOrDefault('site.lightMode',             0),
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

  populateFrom: function(settings) {
    if (settings.site) {
      if (settings.site.lightMode)  { this.site.lightMode  = settings.site.lightMode; }
    }

    if (settings.keys) {
      if (settings.keys.restart)  { this.keys.restart  = settings.keys.restart; }
      if (settings.keys.left)     { this.keys.left     = settings.keys.left; }
      if (settings.keys.right)    { this.keys.right    = settings.keys.right; }
      if (settings.keys.hardDrop) { this.keys.hardDrop = settings.keys.hardDrop; }
      if (settings.keys.softDrop) { this.keys.softDrop = settings.keys.softDrop; }
      if (settings.keys.ccw)      { this.keys.ccw      = settings.keys.ccw; }
      if (settings.keys.cw)       { this.keys.cw       = settings.keys.cw; }
      if (settings.keys.switch)   { this.keys.switch   = settings.keys.switch; }
    }

    if (settings.game) {
      if (settings.game.volume) { this.game.volume = settings.game.volume; }
      if (settings.game.das)    { this.game.das    = settings.game.das; }
      if (settings.game.arr)    { this.game.arr    = settings.game.arr; }
    }
  },

  save: function(toSave) {
    this.site.displayMobileControls = toSave.site.displayMobileControls;
    this.site.lightMode = toSave.site.lightMode;

    localStorage.setItem('site.displayMobileControls', toSave.site.displayMobileControls);
    localStorage.setItem('site.lightMode',             toSave.site.lightMode);

    if (toSave.keys.restart)  { localStorage.setItem('keys.restart',               toSave.keys.restart); }
    if (toSave.keys.left)     { localStorage.setItem('keys.left',                  toSave.keys.left); }
    if (toSave.keys.right)    { localStorage.setItem('keys.right',                 toSave.keys.right); }
    if (toSave.keys.hardDrop) { localStorage.setItem('keys.hardDrop',              toSave.keys.hardDrop); }
    if (toSave.keys.softDrop) { localStorage.setItem('keys.softDrop',              toSave.keys.softDrop); }
    if (toSave.keys.ccw)      { localStorage.setItem('keys.ccw',                   toSave.keys.ccw); }
    if (toSave.keys.cw)       { localStorage.setItem('keys.cw',                    toSave.keys.cw); }
    if (toSave.keys.switch)   { localStorage.setItem('keys.switch',                toSave.keys.switch); }
    if (toSave.game.volume)   { localStorage.setItem('game.volume',                toSave.game.volume); }
    if (toSave.game.das)      { localStorage.setItem('game.das',                   toSave.game.das); }
    if (toSave.game.arr)      { localStorage.setItem('game.arr',                   toSave.game.arr); }

    this.populateFrom(toSave);

    if (CurrentUser.isPresent()) {
      CurrentUser.update({
        settings: {
          keys: this.keys,
          game: this.game,
        }
      });
    }
  },

  beenHereNow: function() {
    this.site.beenHereBefore = 1;
    localStorage.setItem('site.beenHereBefore', 1);
  },

  resetDefaults: function() {
    localStorage.removeItem('site.displayMobileControls');
    localStorage.removeItem('site.lightMode');
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

    this.site.displayMobileControls = valueOrDefault('site.displayMobileControls', isBigScreen() ? 0 : 1);
    this.site.lightMode = valueOrDefault('site.lightMode', 0);

    this.keys.restart = valueOrDefault('keys.restart',  113);
    this.keys.left = valueOrDefault('keys.left',      37);
    this.keys.right = valueOrDefault('keys.right',     39);
    this.keys.hardDrop = valueOrDefault('keys.hardDrop',  38);
    this.keys.softDrop = valueOrDefault('keys.softDrop',  40);
    this.keys.ccw = valueOrDefault('keys.ccw',       88);
    this.keys.cw = valueOrDefault('keys.cw',        67);
    this.keys.switch = valueOrDefault('keys.switch',    90);

    this.game.volume = valueOrDefault('game.volume', 70);
    this.game.das = valueOrDefault('game.das',   183);
    this.game.arr = valueOrDefault('game.arr',    33);

    this.save(this);
  },

  applySiteSettings: function() {
    document.querySelector('body').className = this.site.lightMode === 1 ? 'light-mode' : 'dark-mode';
  }
};
