import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCgeNBHWNWgpY-SJYyS8yKV3iYMDK3PcUE",
  authDomain: "todo-cf426.firebaseapp.com",
  databaseURL: "https://todo-cf426.firebaseio.com",
  projectId: "todo-cf426",
  storageBucket: "todo-cf426.appspot.com",
  messagingSenderId: "801586637990",
  appId: "1:801586637990:web:70d9c557d241e2d9ea1867"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
