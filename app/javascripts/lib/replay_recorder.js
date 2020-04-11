import kissc from '../vendor/kissc';

import Settings from './settings';
import Api from './api';
import CurrentUser from './current_user';
import { replayVersion } from './helpers';

export default class ReplayRecorder {
  constructor(gameMode, seed) {
    this.gameMode = gameMode;
    this.seed = seed;
    this.pieces = [];
    this.moves = [];
    this.currentTime = 0;
  }

  addPiece(gems) {
    this.pieces.push([
      this.simplifyGem(gems[0]),
      this.simplifyGem(gems[1])
    ]);
  }

  addMove(move, options={}) {
    this.moves.push({
      move: move,
      options: options,
      timestamp: this.currentTime,
    });
  }

  output() {
    return {
      gameMode: this.gameMode,
      pieces: this.pieces,
      moves: this.moves,
      settings: {
        seed: this.seed,
        das: Settings.game.das,
        arr: Settings.game.arr,
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
      version: replayVersion(),
      data: this.toString(),
    });
  }

  // Helper methods go here
  simplifyGem(gem) {
    return {
      colour: gem.colour,
      smasher: gem.smasher,
    };
  }
};
