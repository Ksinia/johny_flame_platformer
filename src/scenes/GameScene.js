import Phaser from "phaser";

import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";
import mapJSON from "../../public/assets/volcano2.json";

// constants to avoid typos in reapeated word ground
const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.bombSpawner = undefined;
    this.stars = undefined;

    this.map = undefined;
    this.gameOver = false;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
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
    // this.add.image(400, 300, "sky");
    // const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();

    this.map = this.make.tilemap({ key: "map" });
    // tiles for the ground layer
    const groundTiles = mapJSON.tilesets.map((tileset) =>
      this.map.addTilesetImage(tileset.name)
    );
    // const groundTiles = [this.map.addTilesetImage("volcano_pack_59")];
    const waterTiles = this.map.addTilesetImage("volcano_pack_51");
    // create the ground layer
    const groundLayer = this.map.createDynamicLayer("ground", groundTiles);
    console.log(groundLayer);
    const waterLayer = this.map.createDynamicLayer("water", waterTiles);
    // the player will collide with this layer
    groundLayer.setCollisionByProperty({ collides: true });

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.scoreLabel.scrollFactorX = 0;
    this.scoreLabel.scrollFactorY = 0;
    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    // this.physics.add.collider(this.player, platforms);
    // this.physics.add.collider(this.stars, platforms);
    // this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(
      this.player,
      bombsGroup,
      this.hitBomb,
      null,
      this
    );
    this.physics.add.collider(this.player, groundLayer);
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
    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor("#ccccff");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.scoreLabel.add(10);

    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    this.bombSpawner.spawn(player.x);
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
      // this.player.setVelocityY(-330);
    }
    if (this.scoreLabel.score < 0) {
      console.log(this.scoreLabel.score);
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play("turn");
      this.gameOver = true;
    }
  }

  // createPlatforms() {
  //   const platforms = this.physics.add.staticGroup();

  //   platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

  //   platforms.create(600, 450, GROUND_KEY);
  //   platforms.create(50, 250, GROUND_KEY);
  //   platforms.create(750, 200, GROUND_KEY);

  //   return platforms;
  // }

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
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    return stars;
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }

  hitBomb(player, bomb) {
    // this.physics.pause();
    // player.setTint(0xff0000);
    // player.anims.play("turn");
    this.scoreLabel.add(-10);
    // this.gameOver = true;
  }
}
