
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD9QDNqkherQ-vbf57ceByyjTmMJFFNKFY",
  authDomain: "miniblog-44cdb.firebaseapp.com",
  projectId: "miniblog-44cdb",
  storageBucket: "miniblog-44cdb.appspot.com",
  messagingSenderId: "690652634910",
  appId: "1:690652634910:web:f5a72688ae1686edcd730f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app) // Obter o bando de dados do Firebase

export { db }
