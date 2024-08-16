// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { addDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
// import "firebase/firestore";
// import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "walle-7a034.firebaseapp.com",
  projectId: "walle-7a034",
  storageBucket: "walle-7a034.appspot.com",
  messagingSenderId: "176206594273",
  appId: "1:176206594273:web:3351e09ec96b448d11f7a0",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);

const db = firebase.firestore();

export default firebase;
export { db };
