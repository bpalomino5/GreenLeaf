import React, { Component } from "react";
import SignOutButton from "../components/SignOut";
import withAuthorization from "../components/withAuthorization";
import AuthUserContext from "../components/AuthUserContext";

import { Grid, Card, Table } from "semantic-ui-react";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Grid columns={2} divided padded>
          <Grid.Column width={4}>
            <AuthUserContext.Consumer>
              {authUser => (
                <div>
                  <Card color="blue" raised>
                    <Card.Content>
                      <Card.Header>Brandon Palomino</Card.Header>
                      <Card.Meta>{authUser.email}</Card.Meta>
                      <Card.Meta>Current User</Card.Meta>
                      <Card.Description>Software Engineer</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <SignOutButton />
                    </Card.Content>
                  </Card>
                  <Card color="green" raised>
                    <Card.Content>
                      <Card.Header>Family</Card.Header>
                    </Card.Content>
                    <Card.Content
                      header="Mariella Palomino"
                      meta="Mother"
                      description="Nanny"
                    />
                    <Card.Content
                      header="Luis Palomino"
                      meta="Father"
                      description="Pollero"
                    />
                    <Card.Content
                      header="Melissa Palomino"
                      meta="Sister"
                      description="Corporate Chef"
                    />
                  </Card>
                </div>
              )}
            </AuthUserContext.Consumer>
          </Grid.Column>
          <Grid.Column width={6} computer={11}>
            <Table padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Bill</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>SDE</Table.Cell>
                  <Table.Cell>Payed</Table.Cell>
                  <Table.Cell>House Electricity Bill</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Mortage</Table.Cell>
                  <Table.Cell>Payed</Table.Cell>
                  <Table.Cell>Interest Payment due for the House.</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
