import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUYJDl9eWBijEr64XSwaHt7EnehPKhS-w",
  authDomain: "noto-596d5.firebaseapp.com",
  projectId: "noto-596d5",
  storageBucket: "noto-596d5.appspot.com",
  messagingSenderId: "937697624476",
  appId: "1:937697624476:web:227e8e36d79099e81d0859",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
