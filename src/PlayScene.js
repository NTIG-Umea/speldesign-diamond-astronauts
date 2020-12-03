import Phaser from 'phaser';
import mazeGenerator from './mazeGenerator';
import gameOptions from './gameOptions';
import drawMaze from './drawMaze';
import EasyStar from 'easystarjs';
import santaSprite from './assets/santa.png';
import canMove from './canMove';

export default class PlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'play' });
    this.player;
    this.score = 0;
  }
  preload () {
    this.load.image('santa', santaSprite);
  }

  create () {
    this.mazeGraphics = this.add.graphics();
    this.maze = mazeGenerator();
    this.mazeGraphics = drawMaze(this.maze, this.mazeGraphics);

    // eslint-disable-next-line new-cap
    this.easystar = new EasyStar.js();
    this.easystar.setGrid(this.maze);
    this.easystar.setAcceptableTiles([0]);
    this.easystar.findPath(
      gameOptions.mazeEndX,
      gameOptions.mazeEndY,
      1,
      1,
      function (path) {
        this.drawPath(path);
      }.bind(this)
    );
    this.easystar.calculate();

    // Player stuff
    // centers the player on the current tile
    this.playerX =
      gameOptions.playerStartingX * gameOptions.tileSize +
      gameOptions.tileSize / 2;
    this.playerY =
      gameOptions.playerStartingY * gameOptions.tileSize +
      gameOptions.tileSize / 2;
    this.player = this.add.sprite(this.playerX, this.playerY, 'santa');

    this.player.mazeX = gameOptions.playerStartingX;
    this.player.mazeY = gameOptions.playerStartingY;

    this.player.setPosition(this.playerX, this.playerY);

    // Camera stuff
    this.cameras.main.setBounds(0, 0, gameOptions.mazeWidth * gameOptions.tileSize, gameOptions.mazeHeight * gameOptions.tileSize);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(4);

    // Movement keys
    this.input.keyboard.on('keydown', function (e) {
      switch (e.key) {
        case 'End':
          this.scene.player.mazeX = gameOptions.mazeEndX;
          this.scene.player.mazeY = gameOptions.mazeEndY;
          break;
        case 'w':
        case 'ArrowUp':
          if (canMove('N', this.scene)) this.scene.movePlayer('N');
          break;
        case 'd':
        case 'ArrowRight':
          if (canMove('E', this.scene)) this.scene.movePlayer('E');
          break;
        case 's':
        case 'ArrowDown':
          if (canMove('S', this.scene)) this.scene.movePlayer('S');
          break;
        case 'a':
        case 'ArrowLeft':
          if (canMove('W', this.scene)) this.scene.movePlayer('W');
          break;
      }
    });
  }

  movePlayer (direction) {
    switch (direction) {
      case 'N':
        this.player.mazeY -= 1;
        break;
      case 'E':
        this.player.mazeX += 1;
        break;
      case 'S':
        this.player.mazeY += 1;
        break;
      case 'W':
        this.player.mazeX -= 1;
        break;
    }
    this.updatePlayerPosition();
  }

  updatePlayerPosition () {
    let x = this.player.mazeX * gameOptions.tileSize + gameOptions.tileSize / 2;
    let y = this.player.mazeY * gameOptions.tileSize + gameOptions.tileSize / 2;
    this.player.setPosition(x, y);
    if (
      this.player.mazeX === gameOptions.mazeEndX &&
      this.player.mazeY === gameOptions.mazeEndY
    ) {
      this.score++;
      alert(`Your score was: ${this.score}`); // should use some Phaser implementation of this
      this.scene.start('play');
    }
  }

  drawPath (path) {
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
          // this.scene.start("PlayGame");
        }
      },
      callbackScope: this,
      loop: true
    });
  }
  update () {
    // player.anims.play('walk');
  }
}
