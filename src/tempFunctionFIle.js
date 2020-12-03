window.onload = function () {
  var gameConfig = {
    type: Phaser.CANVAS,
    width: gameOptions.mazeWidth * gameOptions.tileSize,
    height: gameOptions.mazeHeight * gameOptions.tileSize,
    backgroundColor: 0xaaaaaa,
    scene: [playGame],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resize();
  window.addEventListener('resize', resize, false);
};

function resize() {
  var canvas = document.querySelector('canvas');
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowWidth / gameRatio + 'px';
  } else {
    canvas.style.width = windowHeight * gameRatio + 'px';
    canvas.style.height = windowHeight + 'px';
  }
}