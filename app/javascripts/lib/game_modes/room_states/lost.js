import m from 'mithril';

import RoomStatePlaying from './playing';

export default class RoomStateLost extends RoomStatePlaying {
  setup() {
    this.game.playerBoard.overlay = 'Game in progress, waiting for next round...';
    this.game.opponents.forEach(opponent => {
      switch(opponent.playerBoard.player.state) {
        case 'not_ready':
          opponent.playerBoard.overlay = 'Waiting...';
          break;
        case 'playing':
          opponent.playerBoard.overlay = 'Playing!';
          break;
        default:
          console.log(`DUNNO HOW TO HANDLE OPPONENT STATE ${opponent.playerBoard.player.state}`);
      }
    });
  }
}
