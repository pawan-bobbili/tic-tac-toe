import React from "react";

import styles from "./Game.module.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: ["", "", "", "", "", "", "", "", ""],
    };
  }

  render() {
    return (
      <div className={styles.Game}>
        <div className={styles.Board}>
          <div className={styles.Row}>
            <div className={styles.Box}>{this.state.box[0]}</div>
            <div className={styles.Box}>{this.state.box[1]}</div>
            <div className={styles.Box}>{this.state.box[2]}</div>
          </div>
          <div className={styles.Row}>
            <div className={styles.Box}>{this.state.box[3]}</div>
            <div className={styles.Box}>{this.state.box[4]}</div>
            <div className={styles.Box}>{this.state.box[5]}</div>
          </div>
          <div className={styles.Row}>
            <div className={styles.Box}>{this.state.box[6]}</div>
            <div className={styles.Box}>{this.state.box[7]}</div>
            <div className={styles.Box}>{this.state.box[8]}</div>
          </div>
        </div>
        <p>Give Your Response...</p>
      </div>
    );
  }
}

export default Game;
