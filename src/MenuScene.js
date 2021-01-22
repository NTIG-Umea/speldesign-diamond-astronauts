import Phaser from 'phaser';
import gameConfig from './gameConfig';

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menu' });
  }

  create () {
    this.add.text(gameConfig.width / 2, gameConfig.height / 2, 'AMAZING SANTA MAZE\n\n Your goal is to find a gift at the end of this labyrinth\n\nControlls are W,A,S,D or the arow keys\n\nclick to play', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 38
    }).setOrigin(0.5, 0.5);

    this.input.on('pointerdown', function () {
      this.scene.start('play');
    }, this);
  }
}
