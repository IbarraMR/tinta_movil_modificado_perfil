// firebaseConfig.js
// Importar funciones necesarias del SDK modular de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLeSeKge5JY5shRb0Q3It9Nr7ziQSs_Sw",
  authDomain: "tintamovil-d8a5c.firebaseapp.com",
  projectId: "tintamovil-d8a5c",
  storageBucket: "tintamovil-d8a5c.firebasestorage.app",
  messagingSenderId: "1098297711019",
  appId: "1:1098297711019:web:026a55d8fb05d618bf9aee",
  measurementId: "G-S3SX8GHG4W"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics (opcional)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.log("Analytics no disponible en este entorno");
}

// Inicializar servicios
const auth = getAuth(app);         // Autenticación
const db = getFirestore(app);      // Firestore
const storage = getStorage(app);   // Storage

// Exportar para usar en otros archivos
export { app, analytics, auth, db, storage };
