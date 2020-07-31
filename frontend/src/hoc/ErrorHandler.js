import React from "react";

import Modal from "../components/UI/Modal/Modal";
import Spinner from "../components/UI/Spinner/Spinner";

const ErrorHandler = (WrappedComponent, axios, mode) => {
  return class Covered extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Error: null,
        pageFailed: false,
        loading: false,
      };

      this.requestInc = axios.interceptors.request.use((reqConfig) => {
        //this.setState({ pageFailed: false });                                            Using this statement will make Wrapped Component to update without any prop changes. so,if ComponentDidUpdate is used to send async request, then that wrapped component should be PureComponent, Otherwise Infinite Loop will be created.
        this.setState({ loading: true });
        return reqConfig;
      }, this.errorHandler);

      this.responseInc = axios.interceptors.response.use((resConfig) => {
        this.setState({ pageFailed: false, Error: null, loading: false });
        return resConfig;
      }, this.errorHandler);
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.requestInc);
      axios.interceptors.response.eject(this.responseInc);
    }

    errorHandler = (err) => {
      if (err.response) {
        const errors = [];
        let keys = 0;
        for (let error of err.response.data.message) {
          errors.push(
            <p key={keys}>
              <strong>{error}</strong>
            </p>
          );
          keys++;
        }
        this.setState({ Error: errors, pageFailed: true, loading: false });
      } else {
        this.setState({ Error: err.message, pageFailed: true, loading: false });
      }
      return Promise.reject(err);
    };

    ErrorBackdropHandler = () => {
      if (mode === "retry") {
        this.setState({ Error: null });
      } else {
        this.setState({ Error: null, pageFailed: false });
      }
    };

    render() {
      let childComponent = <WrappedComponent {...this.props} />;
      if (this.state.pageFailed && mode === "retry") {
        childComponent = (
          <button onClick={() => this.setState({ pageFailed: false })}>
            RETRY
          </button>
        );
      }
      return (
        <React.Fragment>
          <Modal
            show={this.state.Error}
            modalclosed={this.ErrorBackdropHandler}
          >
            {this.state.Error}
          </Modal>
          <Modal show={this.state.loading}>
            <Spinner />
          </Modal>
          {childComponent}
        </React.Fragment>
      );
    }
  };
};

export default ErrorHandler;
