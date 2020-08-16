import m from 'mithril';

export default class BattleStateBase {
  constructor(game) {
    this.game = game;
    this.setup();
  }

  setup() { }
  teardown() { }
  tick(delta) { }
  input(delta) { }
}
