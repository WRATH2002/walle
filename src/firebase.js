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

// Initialize Firebase Authentication and get a reference to the service
// const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const db = firebase.firestore();

// export function createUserCollection(user) {
//   db.collection("users").doc(user.uid).set({
//     uid: user.uid,
//     // name: user.displayName,
//     email: user.email,
//   });
// }

// export const addTodo = async (user) => {
//   // user.preventDefault();

//   try {
//     const docRef = await addDoc(collection(db, "user.uid"), {
//       uid: user.uid,
//       name: user.displayName,
//       email: user.email,
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// };

// // process.env.
// const colRef = collection(db, "books");

// getDocs(colRef)
//   .then((snapshot) => {
//     console.log(snapshot.docs);
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => console.log(err.message));
// // try {
// //   const docRef = await addDoc(collection(db, "users"), {
// //     first: "Ada",
// //     last: "Lovelace",
// //     born: 1815,
// //   });
// //   console.log("Document written with ID: ", docRef.id);
// // } catch (e) {
// //   console.error("Error adding document: ", e);
// // }

// const db = firebase.firestore();
// db.collection("users")
//   .add({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815,
//   })
//   .then((docRef) => {
//     console.log("Document written with ID: ", docRef.id);
//   })
//   .catch((error) => {
//     console.error("Error adding document: ", error);
//   });

export default firebase;
export { db };
