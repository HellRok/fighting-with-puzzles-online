import kissc from '../vendor/kissc';

import Settings from './settings';
import Api from './api';
import CurrentUser from './current_user';

export default class ReplayRecorder {
  constructor(gameMode) {
    this.gameMode = gameMode;
    this.pieces = [];
    this.moves = [];
    this.currentTime = 0;
  }

  addPiece(gems) {
    this.pieces.push([
      {
        colour: gems[0].colour,
        smasher: gems[0].smasher,
      },
      {
        colour: gems[1].colour,
        smasher: gems[1].smasher,
      },
    ]);
  }

  addMove(move) {
    this.moves.push({
      move: move,
      timestamp: this.currentTime,
    });
  }

  output() {
    return {
      gameMode: this.gameMode,
      pieces: this.pieces,
      moves: this.moves,
      settings: {
        das: Settings.das,
        arr: Settings.arr,
      }
    }
  }

  toString() {
    return kissc.compress(
      JSON.stringify(this.output()),
      6
    );
  }

  persist(mode, time, score) {
    return Api.replaysCreate({
      mode: mode,
      time: time,
      score: score,
      data: this.toString(),
    }).then(() => { CurrentUser.refresh() });
  }
}
