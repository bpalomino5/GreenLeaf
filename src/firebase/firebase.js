import firebase from "firebase/app";
import "firebase/auth";
import FirebaseAPIKey from "../credentials";

const config = {
  apiKey: FirebaseAPIKey,
  authDomain: "greenleaf-8aa9b.firebaseapp.com",
  databaseURL: "https://greenleaf-8aa9b.firebaseio.com",
  projectId: "greenleaf-8aa9b",
  storageBucket: "",
  messagingSenderId: "537893788938"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export { auth };
