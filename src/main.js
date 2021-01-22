import Phaser from 'phaser';
import gameConfig from './gameConfig.js';
import resize from './resize';

window.onload = function () {
  window.focus();
  resize();
  window.addEventListener('resize', resize, false);
};

function newGame () {
  if (game) return;
  game = new Phaser.Game(gameConfig);
  game.global = { score: 0 };
}

function destroyGame () {
  if (!game) return;
  game.destroy(true);
  game.runDestroy();
  game = null;
}

let game;

if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(newGame);
}

if (!game) newGame();
