import Phaser from 'phaser';
import gameConfig from './gameConfig';

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menu' });
  }

  create () {
    this.add.text(gameConfig.width / 2, gameConfig.height / 2, 'AMAZING SANTA MAZE\n\nclick to play', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 48
    }).setOrigin(0.5, 0.5);

    this.input.on('pointerdown', function () {
      this.scene.start('play');
    }, this);
  }
}
