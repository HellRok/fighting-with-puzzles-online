import Player from './player';
import { timestamp } from './helpers';

let player = undefined;
let boards = [];
let lastGameLoop = 0;

function gameLoop() {
  const newTimestamp = timestamp()
  const delta = newTimestamp - lastGameLoop
  lastGameLoop = newTimestamp;

  player.tick(delta);
  setTimeout(gameLoop, 1);
}

function renderLoop() {
  boards.forEach(board => board.render());
  window.requestAnimationFrame(renderLoop)
}

export default function main(loadBoards) {
  boards = loadBoards;
  player = new Player(boards[0]);

  lastGameLoop = timestamp();

  gameLoop();
  renderLoop();
}
