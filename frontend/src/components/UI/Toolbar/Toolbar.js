import { connect } from "react-redux";
import React from "react";

import styles from "./Toolbar.module.css";

const Toolbar = (props) => {
    return (
        <div className={styles.Toolbar}>
            <div className={styles.Title}>Tic-Tac-Toe</div>
            {props.isAuth ? (
                <div className={styles.Nav}>
                    <div>My Account</div>
                    <div>Sign Out</div>
                </div>
            ) : (
                <div className={styles.About}>About Us</div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.authenticated,
    };
};

export default connect(mapStateToProps)(Toolbar);
