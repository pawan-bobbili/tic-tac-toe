import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
            username: "",
            signup: false,
        };
    }

    inputHandler = (event, key) => {
        this.setState({ [key]: event.target.value });
    };

    submissionHandler = (event) => {
        event.preventDefault();
        if (this.state.signup) {
            axios
                .post(
                    "http://localhost:8080/auth/signup",
                    JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                        username: this.state.username,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((result) =>
                    this.setState({ password: "", signup: false })
                )
                .catch((err) => console.log(err));
        } else {
            this.props.signin(this.state.email, this.state.password);
        }
        this.setState({ email: "", password: "" });
    };

    componentDidUpdate() {
        if (this.props.authenticated) {
            this.props.history.replace("/start");
        }
    }

    render() {
        return (
            <div className={styles.Parent}>
                <form className={styles.Form}>
                    {this.state.signup ? (
                        <div className={styles.Elements}>
                            <span>Username</span>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={this.state.username}
                                onChange={(event) =>
                                    this.inputHandler(event, "username")
                                }
                                className={styles.Input}
                            />
                        </div>
                    ) : null}
                    <div className={styles.Elements}>
                        <span>Email</span>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={(event) =>
                                this.inputHandler(event, "email")
                            }
                            className={styles.Input}
                        />
                    </div>
                    <div className={styles.Elements}>
                        <span>Password</span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={(event) =>
                                this.inputHandler(event, "password")
                            }
                            className={styles.Input}
                        />
                    </div>
                    <button
                        className={styles.Submit}
                        onClick={(event) => this.submissionHandler(event)}
                    >
                        {this.state.signup ? "SIGNUP" : "SIGNIN"}
                    </button>
                    <button
                        className={styles.Toggle}
                        onClick={(event) => {
                            if (event) {
                                event.preventDefault();
                            }
                            this.setState((prevState) => {
                                return {
                                    signup: !prevState.signup,
                                    username: "",
                                };
                            });
                        }}
                    >
                        {this.state.signup
                            ? "Already Have Account"
                            : "Create New Account"}
                    </button>
                </form>
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
)(withRouter(ErrorHandler(Auth, axios, "show")));
