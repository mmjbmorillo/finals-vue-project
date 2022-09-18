// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'

import { getAuth } from 'firebase/auth'
import "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7pTFkURh1SmJp5Oc9D5l4X8iUJDpUx0s",
  authDomain: "finals-vue.firebaseapp.com",
  databaseURL: "https://finals-vue-default-rtdb.firebaseio.com",
  projectId: "finals-vue",
  storageBucket: "finals-vue.appspot.com",
  messagingSenderId: "387197437926",
  appId: "1:387197437926:web:2bd31b15470d75249f3827",
  measurementId: "G-Z6N134H6J6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = getAuth();

export { app, auth, database }