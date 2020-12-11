// wormth.meter bar https://phaser.io/examples/v3/view/game-objects/graphics/health-bars-demo#

export default class HealthBar {
  constructor (scene, x, y) {
    // this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar = scene.add.graphics();
    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 76 / 100;

    this.draw();

    scene.add.existing(this.bar);
  }

  decrease (amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return (this.value === 0);
  }

  setPosition (x, y) {
    this.x = x;
    this.y = y;
  }

  draw () {
    this.bar.clear();
    //  BG
    this.bar.fillStyle(0xb2dbed);
    this.bar.fillRect(this.x, this.y, 80, 16);

    //  Health

    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
    this.bar.fillStyle(0xe63b44);

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}
