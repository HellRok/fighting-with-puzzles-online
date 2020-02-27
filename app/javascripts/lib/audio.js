import { Howl, Howler } from 'howler';

import ReplayModel from './settings';

export default {
  lock: new Howl({ src: ['/assets/audio/lock.mp3'] }),
  win:  new Howl({ src: ['/assets/audio/win.mp3'] }),
  lose: new Howl({ src: ['/assets/audio/lose.mp3'] }),

  setVolume: function(volume) { Howler.volume(volume / 100); },
};
