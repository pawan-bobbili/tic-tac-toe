import { connect } from "react-redux";
import React from "react";
import { withRouter } from "react-router-dom";

import Modal from "../../components/UI/Modal/Modal";
import styles from "./Game.module.css";

const messages = ["Give Your Response...", "Waiting for response..."];

class Game extends React.Component {
    constructor(props) {
        super(props);
        let statusIndex, ele;
        const queries = new URLSearchParams(this.props.location.search);
        for (let param of queries.entries()) {
            if (param[0] === "index") {
                statusIndex = +param[1];
                if (+param[1] === 1) {
                    ele = "X";
                } else {
                    ele = "O";
                }
            }
        }
        this.state = {
            box: ["", "", "", "", "", "", "", "", ""],
            statusIndex: statusIndex,
            modalContent: null,
            ele: ele,
        };
    }

    componentDidMount() {
        this.props.socket.on("apply-move", (data) => {
            const updatedBox = [...this.state.box];
            updatedBox[data.pos] = data.ele;
            this.setState((prevState) => {
                return {
                    box: updatedBox,
                    statusIndex: prevState.statusIndex ^ 1,
                };
            });
        });
        this.props.socket.on("server-message", (data) => {
            this.setState({ modalContent: data.message });
        });
        this.props.socket.on("game-over", (data) => {
            this.setState({ modalContent: data.message });
            setTimeout(
                () => this.props.history.replace({ pathname: "/start" }),
                2000
            );
        });
    }

    submitRequest = (pos) => {
        if (this.state.box[pos] !== "") {
            this.setState({ modalContent: "Don't be smart enough !" });
        } else {
            this.props.socket.emit("make-move", { pos: pos });
        }
    };

    render() {
        return (
            <div className={styles.Game}>
                <Modal
                    show={this.state.modalContent}
                    modalclosed={() => this.setState({ modalContent: null })}
                >
                    {this.state.modalContent}
                </Modal>
                <div className={styles.Board}>
                    <div className={styles.Row}>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(0)}
                        >
                            {this.state.box[0]}
                        </div>
                        <div className={styles.ColumnSeperator}></div>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(1)}
                        >
                            {this.state.box[1]}
                        </div>
                        <div className={styles.ColumnSeperator}></div>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(2)}
                        >
                            {this.state.box[2]}
                        </div>
                    </div>
                    <div className={styles.RowSeperator}></div>
                    <div className={styles.Row}>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(3)}
                        >
                            {this.state.box[3]}
                        </div>
                        <div className={styles.ColumnSeperator}></div>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(4)}
                        >
                            {this.state.box[4]}
                        </div>
                        <div className={styles.ColumnSeperator}></div>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(5)}
                        >
                            {this.state.box[5]}
                        </div>
                    </div>
                    <div className={styles.RowSeperator}></div>
                    <div className={styles.Row}>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(6)}
                        >
                            {this.state.box[6]}
                        </div>
                        <div className={styles.ColumnSeperator}></div>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(7)}
                        >
                            {this.state.box[7]}
                        </div>
                        <div className={styles.ColumnSeperator}></div>
                        <div
                            className={[
                                styles.Box,
                                this.state.box[0] === "O"
                                    ? styles.Blue
                                    : styles.Red,
                            ].join(" ")}
                            onClick={() => this.submitRequest(8)}
                        >
                            {this.state.box[8]}
                        </div>
                    </div>
                </div>
                <p className={styles.Status}>
                    {messages[this.state.statusIndex]}
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        socket: state.auth.socket,
    };
};

export default connect(mapStateToProps)(withRouter(Game));
