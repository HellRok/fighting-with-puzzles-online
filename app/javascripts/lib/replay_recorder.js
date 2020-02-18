import kissc from '../vendor/kissc';

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
    }
  }

  toString() {
    return kissc.compress(
      JSON.stringify(this.output()),
      6
    );
  }
}
