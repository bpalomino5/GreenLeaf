import React, { Component } from "react";
import "../styles/Login.css";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class Login extends Component {
  state = {};

  onSubmit = event => {
    const { email, password } = this.state;

    const { history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push("/GreenLeaf/dashboard");
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="grey" textAlign="center">
              <Icon name="signup" /> Log-in to your account
            </Header>
            <Form size="large" onSubmit={this.onSubmit}>
              <Segment stacked>
                <Form.Input
                  value={email}
                  onChange={event =>
                    this.setState(byPropKey("email", event.target.value))
                  }
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Email"
                />
                <Form.Input
                  fluid
                  value={password}
                  onChange={event =>
                    this.setState(byPropKey("password", event.target.value))
                  }
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Button disabled={isInvalid} color="green" fluid size="large">
                  Login
                </Button>
                {error && <p>{error.message}</p>}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Login);
