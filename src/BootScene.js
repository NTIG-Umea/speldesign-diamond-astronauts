import Phaser from 'phaser';
import images from './assets/*.png';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'boot' });
  }

  preload () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    this.load.multiatlas('spritesheet', 'assets/spritesheet.json', 'assets/');

    // this.load.image('santa', [images.santa, images.normal]);
    // this.load.image('maze-floor', [images.maze_floor, images.maze_floor]);
    // this.load.image('maze-top', [images.maze_top, images.maze_top]);
    // this.load.image('maze-floor-red-tint', [images.maze_floor_red_tint, images.maze_floor_red_tint]);

    this.load.on('progress', function (progress) {
      bar.setScale(progress, 1);
    });
  }

  update () {
    this.scene.start('menu');
    // this.scene.start('play');
    // this.scene.remove();
  }
}
