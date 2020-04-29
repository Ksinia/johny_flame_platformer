import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image(
      "background",
      "assets/volcano_tiles/bg_volcano_layers/bg_volcano_6.png"
    );
  }

  create() {
    this.add.image(400, 300, "background");
    const text = this.add
      .text(400, 300, "Start Game", { fontSize: 32 })
      .setOrigin(0.5);
    text.setInteractive({ useHandCursor: true });
    text.on("pointerdown", () => this.clickButton());

    this.input.keyboard.on("keydown-ENTER", () => {
      this.scene.switch("GameScene");
    });
  }

  clickButton() {
    this.scene.switch("GameScene");
  }
}
