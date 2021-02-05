import Phaser from 'phaser';
import gameConfig from './gameConfig';
import Hiscore from './Hiscore';

export default class EndScene extends Phaser.Scene {
  constructor () {
    super({ key: 'end' });
  }

  create () {

    const hiscore = new Hiscore('https://localhost:1234');
    hiscore.getScore(3);

    this.add.text(gameConfig.width / 2, gameConfig.height / 2, `Game Over\n\n Your score was ${this.game.global.score}\n\nGo to menu to start over\n\n< menu >`, {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 38
    }).setOrigin(0.5, 0.5);

    this.cameras.main.setBackgroundColor('#000000');

    this.input.on('pointerdown', function () {
      window.location = location;
    }, this);
  }
}
