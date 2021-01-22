import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'boot' });
  }

  preload () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    this.load.multiatlas('spritesheet', 'assets/spritesheet.json', 'assets/');
    this.load.image('gift', ['assets/gift.png', 'assets/gift_normal.png']);
    this.load.image('rudolphs_nose', ['assets/rudolphs_nose.png', 'assets/rudolphs_nose_normal.png']);
    this.load.image('gingerbread', ['assets/gingerbread.png', 'assets/gingerbread_normal.png']);

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
