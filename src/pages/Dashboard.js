import React, { Component } from "react";
import SignOutButton from "../components/SignOut";
import withAuthorization from "../components/withAuthorization";
import AuthUserContext from "../components/AuthUserContext";
import {
  Grid,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Dropdown
} from "semantic-ui-react";
import { db } from "../firebase";

const formatCurrency = (amount, currency = "USD", locale = "en-us") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

const options = [
  { key: 1, text: "Add Bill", value: 1 },
  { key: 2, text: "Remove Bill", value: 2 }
];

const TableItem = ({ companyName, status, monthlyPayment }) => {
  return (
    <Table.Row>
      <Table.Cell>{companyName}</Table.Cell>
      <Table.Cell>{status ? "Payed" : "No"}</Table.Cell>
      <Table.Cell>{formatCurrency(monthlyPayment)}</Table.Cell>
    </Table.Row>
  );
};

const BudgetTable = ({ bills }) => {
  return (
    <div>
      <Table padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Bill</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Monthly Payment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {bills.map(item => (
            <TableItem
              companyName={item.name}
              status={item.isPayed}
              monthlyPayment={item.mPayment}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

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

class BillActivityMenu extends Component {
  state = { addModalOpen: false, cName: "", mPayment: "" };

  handleFormChange = (e, { name, value }) => this.setState({ [name]: value });
  handleFormSubmit = () => {
    const { cName, mPayment } = this.state;
    db.addBill(cName, mPayment);
    this.setState({ cName: "", mPayment: "" });
    this.handleClose();
  };
  handleChange = (e, { value }) => {
    if (value === 1) this.setState({ addModalOpen: true });
  };

  handleClose = () => this.setState({ addModalOpen: false });

  render() {
    const { addModalOpen, cName, mPayment } = this.state;
    return (
      <Card raised fluid>
        <Card.Content>
          <Card.Header>Bill Activity</Card.Header>
        </Card.Content>
        <Card.Content>
          <Dropdown
            text="Options"
            button
            onChange={this.handleChange}
            options={options}
          />
          <Modal
            open={addModalOpen}
            onClose={this.handleClose}
            size="small"
            dimmer="blurring"
          >
            <Modal.Header>Add Bill</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.handleFormSubmit}>
                <Form.Group>
                  <Form.Input
                    label="Company Name"
                    placeholder="Name"
                    value={cName}
                    name="cName"
                    onChange={this.handleFormChange}
                    width={6}
                  />
                  <Form.Input
                    label="Monthly Payment"
                    placeholder="Value"
                    value={mPayment}
                    width={3}
                    name="mPayment"
                    onChange={this.handleFormChange}
                  />
                </Form.Group>
                <Form.Button>Submit</Form.Button>
              </Form>
            </Modal.Content>
          </Modal>
        </Card.Content>
      </Card>
    );
  }
}

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
