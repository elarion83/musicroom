import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"

// Firebase Configs
const firebaseConfig = {
  apiKey: "AIzaSyDZwf0QdHVOvKPg8n-rAXO2VXOhD4AfsDg",
  authDomain: "musicroom-40637.firebaseapp.com",
  projectId: "musicroom-40637",
  storageBucket: "musicroom-40637.appspot.com",
  messagingSenderId: "498439110710",
  appId: "1:498439110710:web:eb84d5f2dc2bf58ca85897",
  measurementId: "G-M9EKNNEXGJ"
};

// Checking if app already initialize then don't initialize again
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export { db, auth, googleProvider, storage };
