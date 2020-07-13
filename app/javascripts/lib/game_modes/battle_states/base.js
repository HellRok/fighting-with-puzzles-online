import m from 'mithril';

export default class BattleStateBase {
  constructor(game) {
    this.game = game;
    this.setup();
  }

  setup() { }
  teardown() { }

  handle(message) {
    if (message.action === 'attack') {
      if (message.data.uuid && message.data.uuid === this.game.uuid) {
        this.attack(message.data);
      } else {
        return;
      }
    }

    if (message.data.uuid && message.data.uuid === this.game.uuid) { return; }

    switch(message.action) {
      case 'server_shutdown':
        Flash.addFlash({
          level: 'warning',
          text: 'Server shutting down...',
        });
        m.route.set('/online');
        break;

      case 'connected':
        this.connected(message.data);
        break;

      case 'join':
        this.addPlayer(message.data);
        break;

      case 'leave':
        this.removePlayer(message.data.uuid);
        break;

      case 'ready':
        this.readyPlayer(message.data.uuid);
        break;

      case 'unready':
        this.unreadyPlayer(message.data.uuid);
        break;

      case 'start':
        this.start(message.data.seed);
        break;

      case 'lost':
        this.losePlayer(message.data.uuid);
        break;

      case 'won':
        this.winPlayer(message.data.winner, message.data.timestamp);
        break;

      case 'move':
        this.movePlayer(message.data, message.data.timestamp);
        break;

      default:
        console.log(`DUNNO HOW TO HANDLE: ${message.action}`);
    }
  }

  tick(delta) { }
  input(delta) { }

  addPlayer(player) {
    const newBoard = new OpponentBoard(player);
    const newOpponent = new Opponent(newBoard);
    this.game.opponents.push(newOpponent);
    newBoard.displayDropPattern(player.dropPattern);

    if (player.state === 'ready') {
      newOpponent.ready();
    } else if (player.state === 'playing') {
      newOpponent.playerBoard.overlay = undefined;
    }

    m.redraw();
  }

  removePlayer(uuid) {
    this.game.opponents = filter(this.game.opponents, opponent => opponent.playerBoard.id !== uuid)
    m.redraw();
  }

  findPlayer(uuid) {
    return find(this.game.opponents, opponent => opponent.playerBoard.id === uuid);
  }
}
