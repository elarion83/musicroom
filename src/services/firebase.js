import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import  { EmailAuthProvider, getAuth, GoogleAuthProvider  } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
import { getLocale } from "./utils";

// Firebase Configs
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Checking if app already initialize then don't initialize again
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
const auth = getAuth(app);
auth.languageCode = getLocale();
export {auth};
export const mailAndPassProvider = new EmailAuthProvider();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

