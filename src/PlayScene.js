import Phaser from 'phaser';
import mazeGenerator from './mazeGenerator';
import gameOptions from './gameOptions';
import drawMaze from './drawMaze';
import EasyStar from 'easystarjs';
import santaSprite from './assets/santa.png';
import canMove from './canMove';
import mazeTop from './assets/maze-top.png';
import mazeFloor from './assets/maze-floor.png';

export default class PlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'play' });
    this.score = 0;
  }
  preload () {
    this.load.image('santa', santaSprite);
    this.load.image('maze-floor', mazeFloor);
    this.load.image('maze-top', mazeTop);
  }

  create () {
    this.mazeGraphics = this.add.graphics();
    this.maze = mazeGenerator();
    this.mazeGraphics = drawMaze(this.maze, this.mazeGraphics);

    this.mazeGraphicsNew = [];

    this.mazeWalls = this.physics.add.staticGroup();

    for (let y = 0; y < gameOptions.mazeHeight; y++) {
      this.mazeGraphicsNew[y] = [];
      for (let x = 0; x < gameOptions.mazeWidth; x++) {
        if (this.maze[y][x] === 1) {
          // this.mazeGraphicsNew[y][x] = this.physics.add.sprite(x * gameOptions.tileSize + (gameOptions.tileSize / 2), y * gameOptions.tileSize + (gameOptions.tileSize / 2), 'maze-top');
          this.mazeGraphicsNew[y][x] = this.mazeWalls.create(x * gameOptions.tileSize + (gameOptions.tileSize / 2), y * gameOptions.tileSize + (gameOptions.tileSize / 2), 'maze-top');
        } else {
          this.mazeGraphicsNew[y][x] = this.add.sprite(x * gameOptions.tileSize + (gameOptions.tileSize / 2), y * gameOptions.tileSize + (gameOptions.tileSize / 2), 'maze-floor');
        }
      }
    }

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
    this.player = this.physics.add.sprite(this.playerX, this.playerY, 'santa').setScale(0.5);

    for (let i = 0; i < gameOptions.mazeHeight; i++) {
      for (let j = 0; j < gameOptions.mazeWidth; j++) {
        if (this.mazeGraphicsNew[i][j].texture.key === 'maze-top') {
          this.physics.add.collider(this.player, this.mazeGraphicsNew[i][j]);
        }
      }
    }

    this.player.mazeX = gameOptions.playerStartingX;
    this.player.mazeY = gameOptions.playerStartingY;

    this.player.setPosition(this.playerX, this.playerY);

    // Camera stuff
    this.cameras.main.setBounds(0, 0, gameOptions.mazeWidth * gameOptions.tileSize, gameOptions.mazeHeight * gameOptions.tileSize);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(4);

    // Movement keys
    // this.input.keyboard.on('keydown', function (e) {
    //   switch (e.key) {
    //     case 'End':
    //       this.scene.player.mazeX = gameOptions.mazeEndX;
    //       this.scene.player.mazeY = gameOptions.mazeEndY;
    //       this.scene.updatePlayerPosition();
    //       break;
    //     case 'w':
    //     case 'ArrowUp':
    //       if (canMove('N', this.scene)) this.scene.movePlayer('N');
    //       break;
    //     case 'd':
    //     case 'ArrowRight':
    //       if (canMove('E', this.scene)) this.scene.movePlayer('E');
    //       break;
    //     case 's':
    //     case 'ArrowDown':
    //       if (canMove('S', this.scene)) this.scene.movePlayer('S');
    //       break;
    //     case 'a':
    //     case 'ArrowLeft':
    //       if (canMove('W', this.scene)) this.scene.movePlayer('W');
    //       break;
    //   }
    // });

    this.keys = this.input.keyboard.addKeys('W, D, S, A, up, right, down, left');
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
    if (this.keys.W.isDown || this.keys.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.keys.S.isDown || this.keys.down.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.keys.D.isDown || this.keys.right.isDown) {
      this.player.setVelocityX(200);
    } else if (this.keys.A.isDown || this.keys.left.isDown) {
      this.player.setVelocityX(-200);
    } else {
      this.player.setVelocityX(0);
    }
  }
}
