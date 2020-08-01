import { connect } from "react-redux";
import React from "react";
import io from "socket.io-client";

import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import styles from "./Start.module.css";

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      requests: [],
      modalContent: null,
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
    this.props.socket.on("request-declined", () => {
      this.setState({
        modalContent: `${this.state.email} rejected your request`,
      });
      setTimeout(() => {
        this.setState({ modalContent: null });
      }, 3000);
    });
    this.props.socket.on("request-accepted", () => {
      this.setState({
        modalContent: `${this.state.email} accepted your request`,
      });
      setTimeout(() => {
        this.setState({ modalContent: null });
      }, 3000);
    });

    this.props.socket.on("server-message", (data) => {
      this.setState({ modalContent: data.message });
      setTimeout(() => this.setState({ modalContent: null }), 3000);
    });
  }

  acceptHandler = (email) => {
    this.props.socket.emit("request-accepted", { of: email });
    this.state.requests.forEach((request) => {
      if (request.from !== email) {
        this.props.socket.emit("request-declined", { of: email });
      }
    });
    this.setState({ requests: [] });
  };

  inputChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  rejectHandler = (email) => {
    this.props.socket.emit("request-declined", { of: email });
    const newRequests = this.state.requests.filter(
      (request) => request.from !== email
    );
    this.setState({ requests: newRequests });
  };

  sendRequestHandler = () => {
    this.props.socket.emit("send-request", { to: this.state.email });
    this.setState({ modalContent: "Request Send... Waiting For Response" });
  };

  render() {
    const requests = this.state.requests.map((request) => {
      return (
        <div key={request.from}>
          <p>
            <strong>{request.from}</strong> challenged you
          </p>
          <button
            className={styles.Agree}
            onClick={() => this.acceptHandler(request.from)}
          >
            Agree
          </button>
          <button
            className={styles.Reject}
            onClick={() => this.rejectHandler(request.from)}
          >
            Reject
          </button>
        </div>
      );
    });
    return (
      <React.Fragment>
        <Modal show={this.state.modalContent}>
          <Spinner />
          {this.state.modalContent}
        </Modal>
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
