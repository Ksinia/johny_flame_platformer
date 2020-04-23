import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {}

  create() {
    this.add.text(400, 270, "Game Over", {fontSize: 32}).setOrigin(0.5)
    const playAgainText = this.add.text(400, 330, "Play again", {fontSize: 32})
    .setOrigin(0.5)
    playAgainText.setInteractive({ useHandCursor: true });
    playAgainText.on("pointerdown", () => this.clickButton());

    this.input.keyboard.on("keydown-ENTER", (event) => {
      this.clickButton();
    });
  }

  clickButton() {
    const game = this.scene.get("GameScene")
    game.scene.restart()
    this.scene.sleep()
  }
}
