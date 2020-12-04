import Phaser from 'phaser';
import BootScene from './BootScene';
import PlayScene from './PlayScene';
import MenuScene from './MenuScene';
import EndScene from './EndScene';
import gameOptions from './gameOptions';

export default {
  type: Phaser.CANVAS,
  width: gameOptions.mazeWidth * gameOptions.tileSize,
  height: gameOptions.mazeHeight * gameOptions.tileSize,
  backgroundColor: 0xaaaaaa,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [BootScene, MenuScene, PlayScene, EndScene]
};
