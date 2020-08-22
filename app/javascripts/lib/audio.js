import { Howl, Howler } from 'howler';

import ReplayModel from './settings';

export default {
  lock: new Howl({ src: ['/assets/audio/lock.mp3'] }),
  win:  new Howl({ src: ['/assets/audio/win.mp3'] }),
  lose: new Howl({ src: ['/assets/audio/lose.mp3'] }),
  ko:   new Howl({ src: ['/assets/audio/ko.mp3'] }),
  kod:  new Howl({ src: ['/assets/audio/kod.mp3'] }),

  setVolume: function(volume) { Howler.volume(volume / 100); },
};
