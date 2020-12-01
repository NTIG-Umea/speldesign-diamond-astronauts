import Phaser from 'phaser';
import EasyStar from 'easystarjs';
import tempSanta from './assets/santa64.png';

var game;
var player;
var score = 0;

// var gameOptions = {
//   mazeWidth: 31,
//   mazeHeight: 31,
//   tileSize: 64,
//   playerStartingX: 1,
//   playerStartingY: 1,
//   mazeStartingX: 1,
//   mazeStartingY: 1,
//   mazeEndX: 31 - 2, // this should read the value from gameOptions.mazeWidth
//   mazeEndY: 31 - 2,
// };

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

class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  preload() {
    this.load.image('temp-santa', tempSanta);
  }

  create() {
    this.mazeGraphics = this.add.graphics();
    var moves = [];
    this.maze = [];
    for (var i = 0; i < gameOptions.mazeHeight; i++) {
      this.maze[i] = [];
      for (var j = 0; j < gameOptions.mazeWidth; j++) {
        this.maze[i][j] = 1;
      }
    }
    console.log(this.maze);
    var posY = gameOptions.mazeStartingX;
    var posX = gameOptions.mazeStartingY;
    this.maze[posY][posX] = 0;
    moves.push(posX + posX * gameOptions.mazeWidth);
    while (moves.length) {
      var possibleDirections = '';
      if (
        posY + 2 > 0 &&
        posY + 2 < gameOptions.mazeHeight - 1 &&
        this.maze[posY + 2][posX] == 1
      ) {
        possibleDirections += 'S';
      }
      if (
        posY - 2 > 0 &&
        posY - 2 < gameOptions.mazeHeight - 1 &&
        this.maze[posY - 2][posX] == 1
      ) {
        possibleDirections += 'N';
      }
      if (
        posX - 2 > 0 &&
        posX - 2 < gameOptions.mazeWidth - 1 &&
        this.maze[posY][posX - 2] == 1
      ) {
        possibleDirections += 'W';
      }
      if (
        posX + 2 > 0 &&
        posX + 2 < gameOptions.mazeWidth - 1 &&
        this.maze[posY][posX + 2] == 1
      ) {
        possibleDirections += 'E';
      }
      if (possibleDirections) {
        var move = Phaser.Math.Between(0, possibleDirections.length - 1);
        switch (possibleDirections[move]) {
          case 'N':
            this.maze[posY - 2][posX] = 0;
            this.maze[posY - 1][posX] = 0;
            posY -= 2;
            break;
          case 'S':
            this.maze[posY + 2][posX] = 0;
            this.maze[posY + 1][posX] = 0;
            posY += 2;
            break;
          case 'W':
            this.maze[posY][posX - 2] = 0;
            this.maze[posY][posX - 1] = 0;
            posX -= 2;
            break;
          case 'E':
            this.maze[posY][posX + 2] = 0;
            this.maze[posY][posX + 1] = 0;
            posX += 2;
            break;
        }
        moves.push(posX + posY * gameOptions.mazeWidth);
      } else {
        var back = moves.pop();
        posY = Math.floor(back / gameOptions.mazeWidth);
        posX = back % gameOptions.mazeWidth;
      }
    }
    this.drawMaze(posX, posY);
    var easystar = new EasyStar.js();
    easystar.setGrid(this.maze);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(
      gameOptions.mazeEndX,
      gameOptions.mazeEndY,
      1,
      1,
      function (path) {
        this.drawPath(path);
      }.bind(this)
    );
    easystar.calculate();

    // Player stuff
    // centers the player on the current tile
    let playerX =
      gameOptions.playerStartingX * gameOptions.tileSize +
      gameOptions.tileSize / 2;
    let playerY =
      gameOptions.playerStartingY * gameOptions.tileSize +
      gameOptions.tileSize / 2;
    player = this.add.sprite(playerX, playerY, 'temp-santa');

    player.mazeX = gameOptions.playerStartingX;
    player.mazeY = gameOptions.playerStartingY;

    player.setPosition(playerX, playerY);

    // Camera stuff
    this.cameras.main.setBounds(0, 0, gameOptions.mazeWidth * gameOptions.tileSize, gameOptions.mazeHeight * gameOptions.tileSize);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);
    this.cameras.main.setZoom(4);

    // Movement keys
    this.input.keyboard.on('keydown', function (e) {
      switch (e.key) {
        case 'w':
        case 'ArrowUp':
          if (canMove('N')) this.scene.movePlayer('N');
          break;
        case 'd':
        case 'ArrowRight':
          if (canMove('E')) this.scene.movePlayer('E');
          break;
        case 's':
        case 'ArrowDown':
          if (canMove('S')) this.scene.movePlayer('S');
          break;
        case 'a':
        case 'ArrowLeft':
          if (canMove('W')) this.scene.movePlayer('W');
          break;
      }
    });
  }

  movePlayer(direction) {
    switch (direction) {
      case 'N':
        player.mazeY -= 1;
        break;
      case 'E':
        player.mazeX += 1;
        break;
      case 'S':
        player.mazeY += 1;
        break;
      case 'W':
        player.mazeX -= 1;
        break;
    }
    this.updatePlayerPosition();
  }

  updatePlayerPosition() {
    let x = player.mazeX * gameOptions.tileSize + gameOptions.tileSize / 2;
    let y = player.mazeY * gameOptions.tileSize + gameOptions.tileSize / 2;
    player.setPosition(x, y);
    if (
      player.mazeX === gameOptions.mazeEndX &&
      player.mazeY === gameOptions.mazeEndY
    ) {
      score++;
      alert(`Your score was: ${score}`); // should use some Phaser implementation of this
      this.scene.start('PlayGame');
    }
  }

  drawMaze(posX, posY) {
    this.mazeGraphics.fillStyle(0x000000);
    for (var i = 0; i < gameOptions.mazeHeight; i++) {
      for (var j = 0; j < gameOptions.mazeWidth; j++) {
        if (this.maze[i][j] == 1) {
          this.mazeGraphics.fillRect(
            j * gameOptions.tileSize,
            i * gameOptions.tileSize,
            gameOptions.tileSize,
            gameOptions.tileSize
          );
        }
      }
    }
  }
  drawPath(path) {
    var i = 0;
    this.time.addEvent({
      delay: 0,
      callback: function () {
        if (i < path.length) {
          this.mazeGraphics.fillStyle(0x660000);
          this.mazeGraphics.fillRect(
            path[i].x * gameOptions.tileSize + 1,
            path[i].y * gameOptions.tileSize + 1,
            gameOptions.tileSize - 2,
            gameOptions.tileSize - 2
          );
          i++;
        } else {
          //this.scene.start("PlayGame");
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
  update() {
    //player.anims.play('walk');
  }
}

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
