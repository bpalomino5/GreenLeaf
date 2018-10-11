import React, { Component } from "react";
import "./styles/App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Switch, Route } from "react-router-dom";
import withAuthentication from "./components/withAuthentication";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    );
  }
}

export default withAuthentication(App);
