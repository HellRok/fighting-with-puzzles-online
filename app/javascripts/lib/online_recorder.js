import ReplayRecorder from './replay_recorder';

export default class OnlineRecorder extends ReplayRecorder {
  constructor(socket) {
    super('online')
    this.socket = socket;
  }

  addPiece(gems) {
    super.addPiece(gems);
    this.socket.send(JSON.stringify({ addPiece: [
      this.simplifyGem(gems[0]),
      this.simplifyGem(gems[1])
    ] }));
  }

  addMove(move, options={}) {
    super.addMove(move, options);
    console.log('ADDING MOVE');
    this.socket.send(JSON.stringify({ addMove: [move, options] }))
  }
};
