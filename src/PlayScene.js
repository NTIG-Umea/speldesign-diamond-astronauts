import Phaser from 'phaser';
import mazeGenerator from './mazeGenerator';
import gameOptions from './gameOptions';
import drawMaze from './drawMaze';
import EasyStar from 'easystarjs';
import HealthBar from './HelthBar';

export default class PlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'play' });
    this.score = 0;
  }
  preload () {
  }

  create () {
    this.mazeGraphics = this.add.graphics();
    this.maze = mazeGenerator();
    this.mazeGraphics = drawMaze(this.maze, this.mazeGraphics);

    this.mazeGraphicsNew = [];

    this.mazeWalls = this.physics.add.staticGroup();
    this.mazeFloorTiles = this.physics.add.staticGroup();

    for (let y = 0; y < gameOptions.mazeHeight; y++) {
      this.mazeGraphicsNew[y] = [];
      for (let x = 0; x < gameOptions.mazeWidth; x++) {
        if (this.maze[y][x] === 1) {
          this.mazeGraphicsNew[y][x] = this.mazeWalls.create(x * gameOptions.tileSize + (gameOptions.tileSize / 2), y * gameOptions.tileSize + (gameOptions.tileSize / 2), 'maze-top');
        } else {
          this.mazeGraphicsNew[y][x] = this.mazeFloorTiles.create(x * gameOptions.tileSize + (gameOptions.tileSize / 2), y * gameOptions.tileSize + (gameOptions.tileSize / 2), 'maze-floor');
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
    this.player.setSize(46, 64);

    for (let i = 0; i < gameOptions.mazeHeight; i++) {
      for (let j = 0; j < gameOptions.mazeWidth; j++) {
        if (this.mazeGraphicsNew[i][j].texture.key === 'maze-top') {
          this.physics.add.collider(this.player, this.mazeGraphicsNew[i][j]);
        }
      }
    }

    this.physics.add.overlap(this.player, this.mazeGraphicsNew[gameOptions.mazeEndY][gameOptions.mazeEndX], this.clearLevel, null, this);

    this.player.mazeX = gameOptions.playerStartingX;
    this.player.mazeY = gameOptions.playerStartingY;

    this.player.setPosition(this.playerX, this.playerY);

    // Camera stuff
    this.cameras.main.setBounds(0, 0, gameOptions.mazeWidth * gameOptions.tileSize, gameOptions.mazeHeight * gameOptions.tileSize);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(4);
    this.playerHB = new HealthBar(this, this.cameras.main.worldView.x, this.cameras.main.worldView.y);

    this.keys = this.input.keyboard.addKeys('W, D, S, A, up, right, down, left');
  }

  clearLevel () {
    this.score++;
    alert(`Your score was: ${this.score}`); // should use some Phaser implementation of this
    console.log(this);
    gameOptions.mazeWidth += gameOptions.mazeSizeIncrement;
    gameOptions.mazeHeight += gameOptions.mazeSizeIncrement;
    gameOptions.mazeEndX = gameOptions.mazeWidth - 2;
    gameOptions.mazeEndY = gameOptions.mazeHeight - 2;
    this.scene.start('play');
  }

  drawPath (path) {
    let i = 0;
    this.time.addEvent({
      delay: 0,
      callback: function () {
        if (i < path.length) {
          this.mazeGraphicsNew[path[i].y][path[i].x].setTexture('maze-floor-red-tint');
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

    let worldView = this.cameras.main.worldView;
    this.playerHB.setPosition(worldView.x, worldView.y);
    // decrease player health as game goes on
    this.playerHB.decrease(gameOptions.damagePerUpdate);
    if (this.playerHB.value <= 0) {
      alert(`Your score was: ${this.score}`);
      this.scene.switch('end');
    }
    this.playerHB.draw();
  }
}
