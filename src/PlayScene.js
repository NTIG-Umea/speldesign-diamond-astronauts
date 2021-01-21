import Phaser from 'phaser';
import mazeGenerator from './mazeGenerator';
import gameOptions from './gameOptions';
import EasyStar from 'easystarjs';
import HealthBar from './HelthBar';

export default class PlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'play' });
    this.score = 0;
    this.lightSinAngle = 70;
    this.hbIncrement = 0;
  }
  preload () {
  }

  create () {
    // ladda image för pipeline
    this.add.image(0, 0, 'spritesheet').setPipeline('Light2D');

    this.maze = mazeGenerator();

    this.mazeGraphicsNew = [];

    this.mazeWalls = this.physics.add.staticGroup();
    this.mazeFloorTiles = this.physics.add.staticGroup();

    for (let y = 0; y < gameOptions.mazeHeight; y++) {
      this.mazeGraphicsNew[y] = [];
      for (let x = 0; x < gameOptions.mazeWidth; x++) {
        this.mazeGraphicsNew[y][x] = {};
        if (this.maze[y][x] === 1) {
          if (y + 1 < gameOptions.mazeHeight && this.maze[y + 1][x] === 0) {
            this.mazeGraphicsNew[y][x].halfWall = this.mazeWalls.create(
              x * gameOptions.tileSize + (gameOptions.tileSize / 2),
              y * gameOptions.tileSize + (gameOptions.tileSize / 2),
              'spritesheet', 'wall_ice_half_dark').setPipeline('Light2D').setScale(1.05);
            this.mazeGraphicsNew[y][x].halfWall.setRotation(-1 * Math.PI / 2);
          } else {
            this.mazeGraphicsNew[y][x].wall = this.mazeWalls.create(
              x * gameOptions.tileSize + (gameOptions.tileSize / 2),
              y * gameOptions.tileSize + (gameOptions.tileSize / 2),
              'spritesheet', 'wall_ice_dark').setPipeline('Light2D').setScale(1.05);
          }
        } else {
          this.mazeGraphicsNew[y][x].floor = this.mazeFloorTiles.create(
            x * gameOptions.tileSize + (gameOptions.tileSize / 2),
            y * gameOptions.tileSize + (gameOptions.tileSize / 2),
            'spritesheet', Math.random() > 0.5 ? 'floor_stone_cracked' : 'floor_stone')
            .setPipeline('Light2D').setScale(1.05);
        }
      }
    }

    // spawn fireplaces and torches
    // they have a certain % chance of spawning
    this.warmingElements = [];
    this.fireplaces = this.physics.add.staticGroup();
    this.torches = this.physics.add.staticGroup();

    for (let y = 0; y < gameOptions.mazeHeight; y++) {
      for (let x = 0; x < gameOptions.mazeWidth; x++) {
        if (this.mazeGraphicsNew[y][x].hasOwnProperty('floor')) {
          if (Math.random() < gameOptions.fireplaceSpawnChance) {
            this.mazeGraphicsNew[y][x].fireplace = this.fireplaces.create(
              x * gameOptions.tileSize + (gameOptions.tileSize / 2),
              y * gameOptions.tileSize + (gameOptions.tileSize / 2),
              'spritesheet', 'fireplace_frame_1').setSize(4 * gameOptions.tileSize, 4 * gameOptions.tileSize).setPipeline('Light2D');
          }
        } else if (this.mazeGraphicsNew[y][x].hasOwnProperty('halfWall')) {
          if (Math.random() < gameOptions.torchesSpawnChance) {
            this.mazeGraphicsNew[y][x].torch = this.torches.create(
              x * gameOptions.tileSize + (gameOptions.tileSize / 2),
              y * gameOptions.tileSize + (gameOptions.tileSize / 2),
              'spritesheet', 'torch_frame_1').setSize(2 * gameOptions.tileSize, 2 * gameOptions.tileSize).setPipeline('Light2D');
          }
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
    this.player = this.physics.add.sprite(this.playerX, this.playerY, 'spritesheet', 'santa_front').setScale(0.5).refreshBody();
    this.player.setSize(42, 60);

    for (let i = 0; i < gameOptions.mazeHeight; i++) {
      for (let j = 0; j < gameOptions.mazeWidth; j++) {
        let keys = Object.keys(this.mazeGraphicsNew[i][j]);
        if (keys.includes('wall')) {
          this.physics.add.collider(this.player, this.mazeGraphicsNew[i][j].wall);
        } else if (keys.includes('halfWall')) {
          this.physics.add.collider(this.player, this.mazeGraphicsNew[i][j].halfWall);
        }
      }
    }

    // checks if the player has reached the end of the maze
    this.physics.add.overlap(
      this.player,
      this.mazeGraphicsNew[gameOptions.mazeEndY][gameOptions.mazeEndX].floor,
      this.clearLevel,
      null,
      this
    );

    this.player.mazeX = gameOptions.playerStartingX;
    this.player.mazeY = gameOptions.playerStartingY;

    this.player.setPosition(this.playerX, this.playerY);

    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNames('spritesheet', {
        frames: ['santa_back']
      }),
      frameRate: 0,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNames('spritesheet', {
        frames: ['santa_front']
      }),
      frameRate: 0,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_sideways',
      frames: this.anims.generateFrameNames('spritesheet', {
        frames: ['santa_side']
      }),
      frameRate: 0,
      repeat: -1
    });

    this.anims.create({
      key: 'fireplace_flicker',
      frames: this.anims.generateFrameNames('spritesheet', { frames: ['fireplace_frame_1', 'fireplace_frame_14', 'fireplace_frame_2', 'fireplace_frame_3'] }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'torch_flicker',
      frames: this.anims.generateFrameNames('spritesheet', { frames: ['torch_frame_1', 'torch_frame_2'] }),
      frameRate: 6,
      repeat: -1
    });

    // Camera stuff
    this.cameras.main.setBounds(0, 0, gameOptions.mazeWidth * gameOptions.tileSize, gameOptions.mazeHeight * gameOptions.tileSize);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(4);
    this.playerHB = new HealthBar(this, this.cameras.main.worldView.x, this.cameras.main.worldView.y);

    this.keys = this.input.keyboard.addKeys('W, D, S, A, up, right, down, left');

    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 130, 0xffffff, 3).setScrollFactor(1, 1);
    this.lights.enable();
    this.lights.setAmbientColor(0x000000);

    // check if the player is near a warming element
    // if it is, increase the health bar in the next update
    for (let y = 0; y < gameOptions.mazeHeight; y++) {
      for (let x = 0; x < gameOptions.mazeWidth; x++) {
        for (const key in this.mazeGraphicsNew[y][x]) {
          if (this.mazeGraphicsNew[y][x].hasOwnProperty(key)) {
            if (key === 'fireplace' || key === 'torch') {
              let currentElement = this.mazeGraphicsNew[y][x][key];
              this.physics.add.overlap(this.player, this.mazeGraphicsNew[y][x][key], key === 'fireplace' ? () => {
                this.hbIncrement += 0.1;
              } : () => {
                this.hbIncrement += 0.05;
              }, null, this);
              currentElement.anims.play(key === 'fireplace' ? 'fireplace_flicker' : 'torch_flicker');
            }
          }
        }
      }
    }
  }

  clearLevel () {
    this.score++;
    alert(`Good job, you cleared this maze! 🥳 Your score is: ${this.score}`); // should use some Phaser implementation of this
    gameOptions.mazeWidth += gameOptions.mazeSizeIncrement;
    gameOptions.mazeHeight += gameOptions.mazeSizeIncrement;
    gameOptions.mazeEndX = gameOptions.mazeWidth - 2;
    gameOptions.mazeEndY = gameOptions.mazeHeight - 2;
    gameOptions.fireplaceSpawnChance *= gameOptions.warmingElementsDecrement;
    gameOptions.torchesSpawnChance *= gameOptions.warmingElementsDecrement;
    this.scene.start('play');
  }

  drawPath (path) {
    let i = 0;
    this.time.addEvent({
      delay: 0,
      callback: function () {
        if (i < path.length) {
          this.mazeGraphicsNew[path[i].y][path[i].x].floor.setTexture('spritesheet', 'floor_stone_mossy').setPipeline('Light2D');
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
      this.player.anims.play('walk_up', true);
    } else if (this.keys.S.isDown || this.keys.down.isDown) {
      this.player.setVelocityY(200);
      this.player.anims.play('walk_down', true);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.keys.D.isDown || this.keys.right.isDown) {
      this.player.setVelocityX(200);
      this.player.flipX = false;
      this.player.anims.play('walk_sideways', true);
    } else if (this.keys.A.isDown || this.keys.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.flipX = true;
      this.player.anims.play('walk_sideways', true);
    } else {
      this.player.setVelocityX(0);
    }

    // flicker light
    this.lightSinAngle += (Math.random() > 0.5 ? -1 : 1) * this.getRandomArbitrary(0, 0.2);
    if (this.lightSinAngle > 110) {
      this.lightSinAngle = 110;
    } else if (this.lightSinAngle < 70) {
      this.lightSinAngle = 70;
    }
    this.playerLight.setRadius(Math.sin(this.toRadians(this.lightSinAngle)) * 130);

    this.playerLight.x = this.player.x;
    this.playerLight.y = this.player.y;

    let worldView = this.cameras.main.worldView;
    this.playerHB.setPosition(worldView.x, worldView.y);

    // update the players health
    this.hbIncrement -= gameOptions.damagePerUpdate;
    this.playerHB.change(this.hbIncrement);
    this.hbIncrement = 0;
    this.playerHB.draw();

    // check if the player has died
    if (this.playerHB.value <= 0) {
      alert(`It's freezing cold and you didn't keep warm! 🥶 Your score was: ${this.score}`);
      this.scene.switch('end');
    }
  }

  getRandomArbitrary (min, max) {
    return Math.random() * (max - min) + min;
  }

  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
}
