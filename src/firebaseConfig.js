// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfWIBm58oeZ1gM-qLPHxyfnK5D-EwewN0",
  authDomain: "escolademusicasandrovolski.firebaseapp.com",
  projectId: "escolademusicasandrovolski",
  storageBucket: "escolademusicasandrovolski.appspot.com",
  messagingSenderId: "443058843222",
  appId: "1:443058843222:web:9d5c80a086dfa52c6015f7",
  measurementId: "G-WJLG30VC7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializa o Firestore
const analytics = getAnalytics(app);

export { db };