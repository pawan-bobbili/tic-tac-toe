import React from "react";

import Auth from "./containers/Auth/Auth";
import Layout from "./containers/Layout/Layout";
import { Route } from "react-router-dom";
import Start from "./containers/Start/Start";

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Route path="/" exact component={Start} />
      </Layout>
    );
  }
}

export default App;
