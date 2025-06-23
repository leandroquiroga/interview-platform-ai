import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore"


/**
 * Inicializa la aplicación de Firebase Admin solo si no existe una instancia previa.
 * Utiliza las credenciales del entorno para autenticar la conexión.
 * Exporta una función que retorna los servicios de autenticación (auth) y base de datos (db) de Firestore.
 */
const initFirebaseAdmin = () => {
  try {
    const apps = getApps();

    if (!apps.length) {
      console.log("Initializing Firebase Admin with credentials...");
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId) throw new Error("FIREBASE_PROJECT_ID is not defined");
      if (!clientEmail) throw new Error("FIREBASE_CLIENT_EMAIL is not defined");
      if (!privateKey) throw new Error("FIREBASE_PRIVATE_KEY is not defined");

      const processedKey = privateKey.replace(/\\n/g, '\n');

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: processedKey,
        }),
      });
      console.log("Firebase Admin initialized successfully");
    }
    const db = getFirestore();

    return {
      auth: getAuth(),
      db,
    };
  } catch (error: any) {
    console.error("Error initializing Firebase Admin:", error);
    throw new Error(`Failed to initialize Firebase Admin: ${error.message}`);
  }
};

export const { auth, db } = initFirebaseAdmin();