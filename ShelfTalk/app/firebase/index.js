import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, browserSessionPersistence } from "firebase/auth";
import Constants from 'expo-constants';

const apiKey = process.env.FIREBASE_API_KEY || Constants.expoConfig?.extra?.firebaseApiKey;

// https://firebase.google.com/docs/web/setup#available-libraries for additional libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "shelftalk-acf7e.firebaseapp.com",
  projectId: "shelftalk-acf7e",
  storageBucket: "shelftalk-acf7e.firebasestorage.app",
  messagingSenderId: "601251758069",
  appId: "1:601251758069:web:eaadfcb2785f418fa36abc",
  measurementId: "G-XN5CS7RDP2"
};

// Initialize Firebase
const gifgivingApp = getApps().length 
  ? getApp()
  : initializeApp(firebaseConfig);

const googleAuthProvider = new GoogleAuthProvider();
const auth = getAuth(gifgivingApp);
let user = null;
let email = "";
let userID = "";
let username = "";

onAuthStateChanged(auth, (userParam) => {
  if (userParam) {
    user = userParam;
    email = userParam.email;
    userID = userParam.uid;
    username = userParam.displayName;
  }
});

export { auth, googleAuthProvider, user, email, userID, username };