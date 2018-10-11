import React from "react";
import { auth } from "../firebase";
import { Button } from "semantic-ui-react";

const SignOutButton = () => <Button onClick={auth.doSignOut}>Sign Out</Button>;

export default SignOutButton;
