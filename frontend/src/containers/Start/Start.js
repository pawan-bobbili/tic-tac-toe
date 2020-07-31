import React from "react";
import io from "socket.io-client";

import styles from "./Start.module.css";

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      requests: [
        { from: "admin1" },
        { from: "admin1" },
        { from: "admin1" },
        { from: "admin1" },
        { from: "admin1" },
      ],
    };
    //this.socket = io('http://localhost:8080');
  }

  componentDidMount() {
    //this.socket.connect();
  }

  inputChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  render() {
    const requests = this.state.requests.map((request) => {
      return (
        <div>
          <span>{request.from}</span>
          <button>Agree</button>
          <button>Reject</button>
        </div>
      );
    });
    return (
      <React.Fragment>
        <div className={styles.Send}>
          <input
            type="text"
            name="email"
            value={this.state.email}
            placeholder="Email Address"
            onChange={this.inputChangeHandler}
          />
          <button>Send Request</button>
        </div>
        <div className={styles.Recieve}>{requests}</div>
      </React.Fragment>
    );
  }
}

export default Start;
