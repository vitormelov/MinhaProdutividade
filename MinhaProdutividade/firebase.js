// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3R3arv820ls6zkA86b80NV8h4B8HtwGU",
  authDomain: "minhaprodutividade-d5534.firebaseapp.com",
  projectId: "minhaprodutividade-d5534",
  storageBucket: "minhaprodutividade-d5534.appspot.com",
  messagingSenderId: "844935641249",
  appId: "1:844935641249:web:b9e8721abb0fc30255d8e0",
  measurementId: "G-VW056VW18X"
};

// Inicializando o Firebase com as configurações corretas
const app = initializeApp(firebaseConfig);

// Inicializando os serviços Firebase (Auth e Firestore)
const auth = getAuth(app);
const db = getFirestore(app);

// Exportando auth e db para uso no restante do projeto
export { auth, db };