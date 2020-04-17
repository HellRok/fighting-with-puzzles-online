import ReplayRecorder from './replay_recorder';

export default class OnlineRecorder extends ReplayRecorder {
  constructor(socket, uuid) {
    super('online')
    this.socket = socket;
    this.uuid = uuid;
  }

  addPiece(gems) {
    super.addPiece(gems);
    this.send('move', { addPiece: [
      this.simplifyGem(gems[0]),
      this.simplifyGem(gems[1])
    ] });
  }

  addMove(move, options={}) {
    super.addMove(move, options);
    this.send('move', { addMove: [move, options] })
  }

  readyUp() {
    this.send('ready');
  }

  unready() {
    this.send('unready');
  }

  send(action, data={}) {
    this.socket.send(JSON.stringify(
      {
        uuid: this.uuid,
        action: action,
        timestamp: this.currentTime,
        data: data
      }
    ));
  }
};
