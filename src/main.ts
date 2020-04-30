import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
import StartScene from "./scenes/StartScene";
import GameOverScene from "./scenes/GameOverScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  title: "Johny Flame",
  version: "0.0.1",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [StartScene, GameScene, GameOverScene],
};

export default new Phaser.Game(config);
