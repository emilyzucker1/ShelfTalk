import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const apiKey =
  process.env.FIREBASE_API_KEY || Constants.expoConfig?.extra?.firebaseApiKey;

// https://firebase.google.com/docs/web/setup#available-libraries for additional libraries

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "shelftalk-acf7e.firebaseapp.com",
  projectId: "shelftalk-acf7e",
  storageBucket: "shelftalk-acf7e.firebasestorage.app",
  messagingSenderId: "601251758069",
  appId: "1:601251758069:web:eaadfcb2785f418fa36abc",
  measurementId: "G-XN5CS7RDP2",
  measurementId: "G-XN5CS7RDP2",
};

// Initialize Firebase
const shelftalkApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const db = getFirestore(shelftalkApp);

const googleAuthProvider = new GoogleAuthProvider();
const auth = getAuth(shelftalkApp);
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

export { auth, db, email, googleAuthProvider, user, userID, username };

