import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAp2HbI9cfGmv2vd07_S5O18a2bSYKJnk",
  authDomain: "service-desk-app-517a7.firebaseapp.com",
  projectId: "service-desk-app-517a7",
  storageBucket: "service-desk-app-517a7.firebasestorage.app",
  messagingSenderId: "529874991286",
  appId: "1:529874991286:web:c0d002e331bf72b5d38e17",
  measurementId: "G-KM1YJ29JXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);