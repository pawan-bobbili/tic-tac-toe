import React from "react";

import Auth from "./containers/Auth/Auth";
import Game from "./containers/Game/Game";
import Layout from "./containers/Layout/Layout";
import { Route } from "react-router-dom";
import Start from "./containers/Start/Start";

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Route path="/" exact component={Auth} />
        <Route path="/start" exact component={Start} />
        <Route path="/game" exact component={Game} />
      </Layout>
    );
  }
}

export default App;
