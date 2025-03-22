import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";
import "firebase/compat/app-check";

import { firebaseConfig } from "./config";

export const firebaseApp =
  firebase.apps.length === 0
    ? firebase.initializeApp(firebaseConfig)
    : firebase.apps[0];

const appCheck = firebaseApp.appCheck();

appCheck.activate(firebaseConfig.reCAPTCHAKey, true);

const firebaseAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const firebaseFirestore = firebase.firestore();
const firebaseStorage = firebase.storage();
const firebaseStorageRef = firebaseStorage.ref();
const firebaseDatabase = firebase.database();

// AI
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebaseApp);

// Initialize the generative model with a model that supports your use case
const modelAI = getGenerativeModel(vertexAI, {
  model: "gemini-2.0-flash",
  generationConfig: {
    maxOutputTokens: 10,
  },
});

export {
  firebase,
  firebaseAuth,
  firebaseFirestore,
  firebaseDatabase,
  firebaseStorage,
  firebaseStorageRef,
  googleProvider,
  modelAI,
  getGenerativeModel,
  vertexAI,
};
