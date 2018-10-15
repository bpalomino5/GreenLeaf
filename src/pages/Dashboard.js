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
import {
  Card,
  Responsive,
  Sidebar,
  Menu,
  Segment,
  Icon
} from "semantic-ui-react";
import { db } from "../firebase";

class DesktopContainer extends Component {
  render() {
    const { children, profile, users } = this.props;
    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <div className="flex-style full-height">
          <div className="side-col">
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
          {children}
        </div>
      </Responsive>
    );
  }
}

class MobileContainer extends Component {
  state = {};

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
  };

  handleToggle = () =>
    this.setState({ sidebarOpened: !this.state.sidebarOpened });

  render() {
    const { children, profile, users } = this.props;
    const { sidebarOpened } = this.state;
    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar
            direction="right"
            as={Menu}
            animation="uncover"
            vertical
            visible={sidebarOpened}
            style={{ backgroundColor: "#282c34" }}
          >
            <Menu.Item>
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
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: "100vh" }}
          >
            <Segment
              inverted
              textAlign="center"
              style={{ padding: "1em 0em", backgroundColor: "#282c34" }}
              vertical
            >
              <Menu inverted pointing secondary size="large">
                <Menu.Item position="left" header>
                  Green Leaf
                </Menu.Item>
                <Menu.Item onClick={this.handleToggle} position="right">
                  <Icon name="sidebar" />
                </Menu.Item>
              </Menu>
            </Segment>
            <div className="flex-style full-height">{children}</div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

class ResponsiveContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <DesktopContainer {...this.props}>{children}</DesktopContainer>
        <MobileContainer {...this.props}>{children}</MobileContainer>
      </div>
    );
  }
}

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
          key={user.name}
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
      <ResponsiveContainer profile={profile} users={users}>
        <div className="flex-style main-col">
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
      </ResponsiveContainer>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Dashboard);