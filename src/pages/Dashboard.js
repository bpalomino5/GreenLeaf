import React, { Component } from "react";
import "../styles/Dashboard.css";

// comps
import SignOutButton from "../components/SignOut";
import withAuthorization from "../components/withAuthorization";
import AuthUserContext from "../components/AuthUserContext";

// ui components
import BudgetTable from "../components/ui/BudgetTable";
import BillActivityMenu from "../components/ui/BillActivityMenu";

// libs
import { Divider, Card } from "semantic-ui-react";
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
  state = { profile: null, users: [], bills: [], year: "", month: "" };

  async componentDidMount() {
    this.setState({
      profile: await db.getMyUser(),
      users: await db.getOtherUsers(),
      bills: await db.getAllBills()
    });

    let date = new Date();
    let year = date.toLocaleString("en-us", { year: "numeric" });
    let month = date.toLocaleString("en-us", { month: "long" });
    this.setState({ year, month });
  }

  addedBill = async () => {
    const { year, month } = this.state;
    this.setState({ bills: await db.getAllBills(year, month) });
  };

  changeYear = async (e, { value }) => {
    const { month } = this.state;
    this.setState({ year: value, bills: await db.getAllBills(value, month) });
  };

  changeMonth = async (e, { value }) => {
    const { year } = this.state;
    this.setState({ month: value, bills: await db.getAllBills(year, value) });
  };

  render() {
    const { profile, users, bills, year, month } = this.state;
    return (
      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            display: "flex",
            flex: 0,
            padding: 20
          }}
        >
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
        </div>
        <div
          style={{
            overflowY: "scroll",
            display: "flex",
            flex: 1,
            padding: 20,
            flexDirection: "column"
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <BillActivityMenu
              year={year}
              month={month}
              changeYear={this.changeYear}
              changeMonth={this.changeMonth}
              addedBill={this.addedBill}
            />
          </div>
          <BudgetTable bills={bills} year={year} month={month} />
        </div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
