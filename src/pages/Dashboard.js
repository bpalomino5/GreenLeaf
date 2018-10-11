import React, { Component } from "react";
import SignOutButton from "../components/SignOut";
import withAuthorization from "../components/withAuthorization";
import AuthUserContext from "../components/AuthUserContext";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser => <div>Hello {authUser.email}</div>}
        </AuthUserContext.Consumer>
        <SignOutButton />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
