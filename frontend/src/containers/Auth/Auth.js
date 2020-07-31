import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import React from "react";

import * as actions from "../../store/actions";
import ErrorHandler from "../../hoc/ErrorHandler";
import styles from "./Auth.module.css";

class Auth extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      signup: true,
    };
  }

  inputHandler = (event, key) => {
    this.setState({ [key]: event.target.value });
  };

  submissionHandler = () => {
    if (this.state.signup) {
      axios
        .post(
          "http://localhost:8080/auth/signup",
          JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => this.setState({ password: "", signup: false }))
        .catch((err) => console.log(err));
    } else {
      this.props.signin(this.state.email, this.state.password);
    }
  };

  render() {
    if (this.props.authenticated) {
      return <Redirect to="/game" />;
    }
    return (
      <div className={styles.Parent}>
        <div className={styles.Form}>
          <div className={styles.Elements}>
            <p className={styles.Labels}>Email</p>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={(event) => this.inputHandler(event, "email")}
              className={styles.Input}
            />
          </div>
          <div className={styles.Elements}>
            <p className={styles.Labels}>Password</p>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={(event) => this.inputHandler(event, "password")}
              className={styles.Input}
            />
          </div>
          <button
            className={styles.Toggle}
            onClick={() =>
              this.setState((prevState) => {
                return { signup: !prevState.signup };
              })
            }
          >
            {this.state.signup ? "Already Have Account" : "Create New Account"}
          </button>
          <button
            className={styles.Submit}
            onClick={() => this.submissionHandler()}
          >
            {this.state.signup ? "SignUp" : "SignIn"}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signin: (email, password) => dispatch(actions.signin(email, password)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorHandler(Auth, axios, "show"));
