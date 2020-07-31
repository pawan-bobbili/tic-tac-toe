import React from "react";

import Auth from "./containers/Auth/Auth";
import Layout from "./containers/Layout/Layout";
import { Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Route path="/" exact component={Auth} />
      </Layout>
    );
  }
}

export default App;
