import React, { Component } from "react";

// comps
import SignOutButton from "../components/SignOut";
import withAuthorization from "../components/withAuthorization";
import AuthUserContext from "../components/AuthUserContext";

// ui components
import BudgetTable from "../components/ui/BudgetTable";
import BillActivityMenu from "../components/ui/BillActivityMenu";

// libs
import { Grid, Card } from "semantic-ui-react";
import { db } from "../firebase";

const UserCard = ({ profile, email }) => {
  return (
    <Card color="blue" raised>
      <Card.Content>
        <Card.Header>{profile.name}</Card.Header>
        <Card.Meta>{email}</Card.Meta>
        <Card.Meta>Current User</Card.Meta>
        <Card.Description>{profile.occupation}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <SignOutButton />
      </Card.Content>
    </Card>
  );
};

const FamilyCard = ({ users }) => {
  return (
    <Card color="green" raised>
      <Card.Content>
        <Card.Header>Family</Card.Header>
      </Card.Content>
      {users.map(user => (
        <Card.Content
          header={user.name}
          meta={user.member}
          description={user.occupation}
        />
      ))}
    </Card>
  );
};

class Dashboard extends Component {
  state = { profile: null, users: [], bills: [] };

  async componentDidMount() {
    this.setState({
      profile: await db.getMyUser(),
      users: await db.getOtherUsers(),
      bills: await db.getAllBills()
    });
  }

  render() {
    const { profile, users, bills } = this.state;
    return (
      <div>
        <Grid columns={2} divided padded>
          <Grid.Column width={4}>
            <AuthUserContext.Consumer>
              {authUser => (
                <div>
                  {profile && (
                    <UserCard email={authUser.email} profile={profile} />
                  )}
                  <FamilyCard users={users} />
                </div>
              )}
            </AuthUserContext.Consumer>
          </Grid.Column>
          <Grid.Column width={6} computer={11}>
            <BillActivityMenu />
            <BudgetTable bills={bills} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
