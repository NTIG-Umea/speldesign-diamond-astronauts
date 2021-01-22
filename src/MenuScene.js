import Phaser from 'phaser';
import gameConfig from './gameConfig';

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menu' });
  }

  create () {
    this.add.text(gameConfig.width / 2, gameConfig.height / 2, 'AMAZING SANTA MAZE\n\n Your goal is to find the 🎁 at the end of this maze\n\nUse W,A,S,D or the arrow keys to find your way out\n\n< click to play >', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 38
    }).setOrigin(0.5, 0.5);

    this.cameras.main.setBackgroundColor('#000000');

    this.input.on('pointerdown', function () {
      this.scene.start('play');
    }, this);
  }
}
