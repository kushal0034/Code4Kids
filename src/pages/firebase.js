// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxR0_kCDUeNPGMSIsZEDIvi-EXBbjGaWA",
  authDomain: "code4kids-1224d.firebaseapp.com",
  projectId: "code4kids-1224d",
  storageBucket: "code4kids-1224d.firebasestorage.app",
  messagingSenderId: "136505453195",
  appId: "1:136505453195:web:e4489e3ab246954f49c28e",
  measurementId: "G-7DN0T7H548"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;