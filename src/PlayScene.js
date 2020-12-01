import Phaser from 'phaser';
import mazeGenerator from './mazeGenerator';
import gameOptions from './gameOptions';
import drawMaze from './drawMaze';
import EasyStar from 'easystarjs';
import tempSanta from './assets/santa64.png';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({key: 'play'});
  }
  preload() {
    this.load.image('temp-santa', tempSanta);
  }

  create() {
    this.mazeGraphics = this.add.graphics();
    this.maze = mazeGenerator();
    this.mazeGraphics = drawMaze();

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
      this.scene.start('PlayScene');
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
