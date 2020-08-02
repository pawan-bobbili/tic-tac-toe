import { connect } from "react-redux";
import React from "react";

import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import styles from "./Start.module.css";

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
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
        modalContent: `${this.state.name} rejected your request`,
      });
      setTimeout(() => {
        this.setState({ modalContent: null });
      }, 3000);
    });

    this.props.socket.on("request-accepted", () => {
      this.setState({
        modalContent: `${this.state.name} accepted your request`,
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

  acceptHandler = (name) => {
    this.props.socket.emit("request-accepted", { of: name });
    this.state.requests.forEach((request) => {
      if (request.from !== name) {
        this.props.socket.emit("request-declined", { of: name });
      }
    });
    this.setState({ requests: [] });
  };

  inputChangeHandler = (event) => {
    this.setState({ name: event.target.value });
  };

  rejectHandler = (name) => {
    this.props.socket.emit("request-declined", { of: name });
    const newRequests = this.state.requests.filter(
      (request) => request.from !== name
    );
    this.setState({ requests: newRequests });
  };

  sendRequestHandler = () => {
    this.props.socket.emit("send-request", { to: this.state.name });
    this.setState({
      modalContent: (
        <React.Fragment>
          <Spinner />
          <p style={{ boxShadow: "0", border: "0" }}>
            {" "}
            {/* deliberately putted as these properties were assigned values automatically */}
            Request Send... Waiting For Response
          </p>
        </React.Fragment>
      ),
    });
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
        <Modal show={this.state.modalContent}>{this.state.modalContent}</Modal>
        <div className={styles.Send}>
          <input
            type="text"
            name="name"
            value={this.state.name}
            placeholder="Username"
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
