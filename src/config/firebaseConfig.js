// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCsShG4KoQaZk2n4sHYOpEKY8F9jmMKd_8",
  authDomain: "tinta-8510b.firebaseapp.com",
  projectId: "tinta-8510b",
  storageBucket: "tinta-8510b.appspot.com", // corregido: ".app" → ".appspot.com"
  messagingSenderId: "861865218686",
  appId: "1:861865218686:web:4d9e1d58968ec2af13fe2f"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Servicios que vamos a usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
