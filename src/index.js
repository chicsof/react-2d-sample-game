import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Amplify from "aws-amplify";
// import awsconfig from "./aws-exports";

// Amplify.configure(awsconfig);

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
