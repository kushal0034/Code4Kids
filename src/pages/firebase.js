// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAxR0_kCDUeNPGMSIsZEDIvi-EXBbjGaWA",
  authDomain: "code4kids-1224d.firebaseapp.com",
  projectId: "code4kids-1224d",
  storageBucket: "code4kids-1224d.firebasestorage.app",
  messagingSenderId: "136505453195",
  appId: "1:136505453195:web:e4489e3ab246954f49c28e",
  measurementId: "G-7DN0T7H548"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBuZhroBZxQjPa90g4e7N3uyEZB3ylORXo",
//   authDomain: "code4kids-6d0b8.firebaseapp.com",
//   projectId: "code4kids-6d0b8",
//   storageBucket: "code4kids-6d0b8.firebasestorage.app",
//   messagingSenderId: "890917379223",
//   appId: "1:890917379223:web:1907914a205d144ec79dd2",
//   measurementId: "G-ZBHJ6SS4Z2"
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;