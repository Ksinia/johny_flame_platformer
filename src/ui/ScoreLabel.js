import Phaser from "phaser";

const formatScore = (score, highScore) =>
  `Score: ${score}\nHigh Score: ${highScore}`;

const style = { fontSize: 32, fill: "#fff" };

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, highScore) {
    super(scene, x, y, formatScore(score, highScore), style);

    this.score = score;
    this.highScore = highScore;
  }

  setScore(score) {
    this.score = score;
    this.updateScoreText();
  }
  setHighScore(highScore) {
    this.highScore = highScore;
    this.updateScoreText();
  }

  add(points) {
    this.setScore(this.score + points);
  }

  updateScoreText() {
    this.setText(formatScore(this.score, this.highScore));
  }
}
