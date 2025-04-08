import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore"; // Import getFirestore

const firebaseConfig = {
    apiKey: "AIzaSyB7co7v87wbZTuacsTQUso7ujGdnVwupEg",
    authDomain: "crediblock-xyz.firebaseapp.com",
    projectId: "crediblock-xyz",
    storageBucket: "crediblock-xyz.firebasestorage.app",
    messagingSenderId: "879006897557",
    appId: "1:879006897557:web:62e0e2593becfdc026129c"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth, collection, doc, getDoc, getDocs, getFirestore }; // Export getFirestore