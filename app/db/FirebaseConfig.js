// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0bK7Zbz4ON_mnCQ9xFlTeP4KyurZBAQY",
  authDomain: "hocreate-88288.firebaseapp.com",
  projectId: "hocreate-88288",
  storageBucket: "hocreate-88288.appspot.com",
  messagingSenderId: "977233090619",
  appId: "1:977233090619:web:583ae95224f26e43b0e41e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
