import Phaser from "phaser";

import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";
import mapJSON from "../../public/assets/volcano2.json";

// constants
const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";
const BACKGROUND_LAYER_BASE_KEY = "background_";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.worldWidth = 4480;
    this.worldHeight = 1280;

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.highScore = undefined;
    this.bombSpawner = undefined;
    this.stars = undefined;

    this.background = undefined;

    this.map = undefined;
    this.gameOver = false;
  }

  preload() {
    for (let i = 1; i <= 6; i++) {
      this.load.image(
        `${BACKGROUND_LAYER_BASE_KEY}${i}`,
        `assets/volcano_tiles/bg_volcano_layers/bg_volcano_${i}.png`
      );
    }
    this.load.image(GROUND_KEY, "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image(BOMB_KEY, "assets/bomb.png");

    this.load.tilemapTiledJSON("map", "assets/volcano2.json");
    mapJSON.tilesets.forEach((tileset) =>
      this.load.spritesheet(tileset.name, `assets/${tileset.image}`, {
        frameWidth: tileset.tilewidth,
        frameHeight: tileset.tileheight,
      })
    );

    this.load.spritesheet(DUDE_KEY, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.gameOver = false;

    this.background = this.createBackground();

    this.player = this.createPlayer();
    this.stars = this.createStars();

    this.map = this.make.tilemap({ key: "map" });
    // tiles for the ground layer
    const groundTiles = mapJSON.tilesets.map((tileset) =>
      this.map.addTilesetImage(tileset.name)
    );
    // tiles for the water layer
    const waterTiles = this.map.addTilesetImage("volcano_pack_51");
    // create the ground layer
    const groundLayer = this.map.createDynamicLayer("ground", groundTiles);

    // create the water layer
    const waterLayer = this.map.createDynamicLayer("water", waterTiles);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    this.highScore = localStorage.getItem("highScore") || 0;
    localStorage.setItem("highScore", this.highScore);
    // creare score label in the left top corner which moves with the camera
    this.scoreLabel = new ScoreLabel(
      this,
      16,
      16,
      0,
      this.highScore
    ).setScrollFactor(0, 0);
    this.add.existing(this.scoreLabel);
    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    // set collisions
    groundLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, groundLayer);
    
    // 8 is id of water tile
    waterLayer.setTileIndexCallback(8, ()=>{this.player.disableBody(); this.gameOverMethod()}, this);
    this.physics.add.overlap(this.player, waterLayer);

    this.physics.add.collider(
      this.player,
      bombsGroup,
      this.hitBomb,
      null,
      this
    );

    this.physics.add.collider(this.stars, groundLayer);

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on("keydown-Q", () => {
      this.gameOverMethod();
    });
  }

  update() {
    if (this.gameOver) {
      return;
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (
      this.cursors.up.isDown &&
      (this.player.body.touching.down || this.player.body.onFloor())
    ) {
      this.player.setVelocityY(-400);
    }
    if (this.scoreLabel.score < 0) {
      this.gameOverMethod();
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.scoreLabel.add(10);
    if (this.scoreLabel.score > this.highScore) {
      this.highScore = this.scoreLabel.score;
      localStorage.setItem("highScore", this.scoreLabel.score);
      this.scoreLabel.setHighScore(this.scoreLabel.score);
    }
    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    this.bombSpawner.spawn(player.x);
  }

  createBackground() {
    // Base width and height of the images
    const imageBaseWidth = 1280;
    const imageBaseHeight = 720;
    const ratio = this.worldHeight / imageBaseHeight;
    const imageWidth = imageBaseWidth * ratio;

    const backgroundLayers = this.physics.add.staticGroup();

    // add fixed layer of backround
    backgroundLayers
      .create(0, 0, `${BACKGROUND_LAYER_BASE_KEY}6`)
      .setOrigin(0, 0)
      .setScale(ratio)
      .setScrollFactor(0, 1)
      .refreshBody();

    // add parallaxing layers of background
    this.createBackgroundElements(
      backgroundLayers,
      imageWidth,
      ratio,
      this.worldHeight,
      5,
      0.1
    );
    this.createBackgroundElements(
      backgroundLayers,
      imageWidth,
      ratio,
      700,
      4,
      0.2
    );
    this.createBackgroundElements(
      backgroundLayers,
      imageWidth,
      ratio,
      600,
      3,
      0.3
    );
    this.createBackgroundElements(
      backgroundLayers,
      imageWidth,
      ratio,
      450,
      2,
      0.4
    );
    this.createBackgroundElements(
      backgroundLayers,
      imageWidth,
      ratio,
      320,
      1,
      0.5
    );
    return backgroundLayers;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, DUDE_KEY);
    player.setBounce(0.1);
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

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 20,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    return stars;
  }

  hitBomb() {
    this.scoreLabel.add(-10);
  }

  createBackgroundElements(
    group,
    imageWidth,
    ratio,
    verticalOffset,
    key,
    xScrollFactor
  ) {
    for (let i = 0; i * imageWidth <= this.worldWidth; i++) {
      group
        .create(
          i * imageWidth,
          this.worldHeight - verticalOffset,
          `${BACKGROUND_LAYER_BASE_KEY}${key}`
        )
        .setOrigin(0, 0)
        .setScale(ratio)
        .setScrollFactor(xScrollFactor, 1)
        .refreshBody();
    }
  }

  gameOverMethod() {
    this.player.disableBody()
    this.gameOver = true;
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.cameras.main.fadeOut(5000, 128, 128, 128, (_, progress) => {
      if (progress >= 0.5) {
        this.scene.pause();
      }
    });
    this.scene.run("GameOverScene");
  }
}
