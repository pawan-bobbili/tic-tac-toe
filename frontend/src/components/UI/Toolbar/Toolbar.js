import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import React from "react";

import * as actions from "../../../store/actions/index";
import styles from "./Toolbar.module.css";

// const Toolbar = (props) => {
//     return (
//         <div className={styles.Toolbar}>
//             <div className={styles.Title}>Tic-Tac-Toe</div>
//             {props.isAuth ? (
//                 <div className={styles.Nav}>
//                     <div>My Account</div>
//                     <div
//                         onClick={() => {
//                             props.socket.disconnect();
//                             props.signout();
//                             useHistory().push("/");
//                         }}
//                     >
//                         Sign Out
//                     </div>
//                 </div>
//             ) : (
//                 <div className={styles.About}>About Us</div>
//             )}
//         </div>
//     );
// };

class T extends React.Component {
    render() {
        return (
            <div className={styles.Toolbar}>
                <div className={styles.Title}>Tic-Tac-Toe</div>
                {this.props.isAuth ? (
                    <div className={styles.Nav}>
                        <div>My Account</div>
                        <div
                            onClick={() => {
                                this.props.socket.disconnect();
                                this.props.signout();
                                this.props.history.push("/");
                            }}
                        >
                            Sign Out
                        </div>
                    </div>
                ) : (
                    <div className={styles.About}>About Us</div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.authenticated,
        socket: state.auth.socket,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signout: () => dispatch(actions.signout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(T));
