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

function canMove(direction) {
  let playGame = game.scene.scenes[0];
  switch (direction) {
    case 'N':
      if (playGame.maze[player.mazeY - 1][player.mazeX] === 0) {
        return true;
      }
      break;
    case 'E':
      if (playGame.maze[player.mazeY][player.mazeX + 1] === 0) {
        return true;
      }
      break;
    case 'S':
      if (playGame.maze[player.mazeY + 1][player.mazeX] === 0) {
        return true;
      }
      break;
    case 'W':
      if (playGame.maze[player.mazeY][player.mazeX - 1] === 0) {
        return true;
      }
      break;
    default:
      return false;
  }

  return false;
}

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