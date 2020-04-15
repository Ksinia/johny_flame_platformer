import Phaser from "phaser";

// constants to avoid typos in reapeated word ground
const GROUND_KEY = "ground";
const DUDE_KEY = "dude";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.player = undefined;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image(GROUND_KEY, "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet(DUDE_KEY, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();

    this.physics.add.collider(this.player, platforms);
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);

    return platforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, DUDE_KEY);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }
}
