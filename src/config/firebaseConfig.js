import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCsShG4KoQaZk2n4sHYOpEKY8F9jmMKd_8",
  authDomain: "tinta-8510b.firebaseapp.com",
  projectId: "tinta-8510b",
  storageBucket: "tinta-8510b.firebasestorage.app",
  messagingSenderId: "861865218686",
  appId: "1:861865218686:web:4d9e1d58968ec2af13fe2f"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
