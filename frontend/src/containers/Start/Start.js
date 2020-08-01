import { connect } from "react-redux";
import React from "react";
import io from "socket.io-client";

import styles from "./Start.module.css";

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      requests: [{ from: "admin5" }],
    };
    //this.socket = io("http://localhost:8080");
  }

  componentDidMount() {
    this.props.socket.on("recieve-request", (data) => {
      let arr = [];
      arr.push({ from: data.from });
      arr = [...arr, ...this.state.requests];
      this.setState({ requests: arr });
    });
  }

  inputChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  sendRequestHandler = () => {
    this.props.socket.emit("send-request", { to: this.state.email });
  };

  render() {
    const requests = this.state.requests.map((request) => {
      return (
        <div key={request.from}>
          <p>
            <strong>{request.from}</strong> challenged you
          </p>
          <button className={styles.Agree}>Agree</button>
          <button className={styles.Reject}>Reject</button>
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
          <button onClick={this.sendRequestHandler}>Send Request</button>
        </div>
        <div className={styles.Recieve}>{requests}</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    socket: state.auth.socket,
  };
};

export default connect(mapStateToProps)(Start);
