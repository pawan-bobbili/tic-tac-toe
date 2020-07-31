import React from "react";

import Toolbar from "../../components/UI/Toolbar/Toolbar";

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Toolbar />
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default Layout;
