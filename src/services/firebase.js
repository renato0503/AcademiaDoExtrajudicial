import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * 📝 Nota Tech Lead: 
 * Inicialização centralizada do Firebase utilizando SDK v9 modular.
 * As chaves são carregadas a partir de variáveis de ambiente via Vite (import.meta.env)
 * para evitar chaves hardcodadas e garantir a segurança do ambiente.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app;
let db;
let auth;
let storage;

// Validação de configuração mínima para inicialização ativa
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("⚠️ Falha ao inicializar os serviços do Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase não configurado. Defina as variáveis de ambiente (.env). Rodando em modo de demonstração local.");
}

export { app, db, auth, storage };
