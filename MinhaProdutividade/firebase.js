import { initializeApp, getApps } from 'firebase/app';  // Adiciona getApps para verificar se o Firebase já foi inicializado
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3R3arv820ls6zkA86b80NV8h4B8HtwGU",
  authDomain: "minhaprodutividade-d5534.firebaseapp.com",
  projectId: "minhaprodutividade-d5534",
  storageBucket: "minhaprodutividade-d5534.appspot.com",
  messagingSenderId: "844935641249",
  appId: "1:844935641249:web:b9e8721abb0fc30255d8e0",
  measurementId: "G-VW056VW18X"
};

// Inicializa o Firebase apenas se ele ainda não tiver sido inicializado
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];  // Pega a instância existente do Firebase
}

// Inicializa o Firebase Auth com AsyncStorage para persistência
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)  // Define a persistência com AsyncStorage
  });
} catch (e) {
  // Se o Firebase Auth já estiver inicializado, captura o erro e usa o auth existente
  auth = getAuth(app);
}

// Inicializa o Firestore
const db = getFirestore(app);

export { auth, db };
