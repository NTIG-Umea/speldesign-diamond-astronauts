import Phaser from 'phaser';
import gameConfig from './gameConfig';

export default class EndScene extends Phaser.Scene {
  constructor () {
    super({ key: 'end' });
  }

  create () {
    this.add.text(gameConfig.width / 2, gameConfig.height / 2, `Game Over\n\n Your score was ${this.game.global.score}\n\nGo to menu to start over\n\n< menu >`, {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 38
    }).setOrigin(0.5, 0.5);

    this.input.on('pointerdown', function () {
      this.scene.switch('menu');
    }, this);
  }
}
