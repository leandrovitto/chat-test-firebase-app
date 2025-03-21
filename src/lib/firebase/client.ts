import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";

import { firebaseConfig } from "./config";

export const firebaseApp =
  firebase.apps.length === 0
    ? firebase.initializeApp(firebaseConfig)
    : firebase.apps[0];

const firebaseAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const firebaseFirestore = firebase.firestore();
const firebaseStorage = firebase.storage();
const firebaseStorageRef = firebaseStorage.ref();
const firebaseDatabase = firebase.database();

export {
  firebase,
  firebaseAuth,
  firebaseFirestore,
  firebaseDatabase,
  firebaseStorage,
  firebaseStorageRef,
  googleProvider,
};
