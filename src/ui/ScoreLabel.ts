import Phaser from "phaser";

const formatScore = (score: number, highScore: number) =>
  `Score: ${score}\nHigh Score: ${highScore}`;

const style: any = { fontSize: 32, fill: "#fff" };

export default class ScoreLabel extends Phaser.GameObjects.Text {
  score: number;
  highScore: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    score: number,
    highScore: number
  ) {
    super(scene, x, y, formatScore(score, highScore), style);

    this.score = score;
    this.highScore = highScore;
  }

  setScore(score: number) {
    this.score = score;
    this.updateScoreText();
  }
  setHighScore(highScore: number) {
    this.highScore = highScore;
    this.updateScoreText();
  }

  add(points: number) {
    this.setScore(this.score + points);
  }

  updateScoreText() {
    this.setText(formatScore(this.score, this.highScore));
  }
}
