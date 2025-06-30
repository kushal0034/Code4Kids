// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8DukbBkQiMJAPV84pLnhLVUx_NXE90Ko",
  authDomain: "code4kids-895f4.firebaseapp.com",
  projectId: "code4kids-895f4",
  storageBucket: "code4kids-895f4.firebasestorage.app",
  messagingSenderId: "599702627168",
  appId: "1:599702627168:web:f1d6b7e7799c836523f405",
  measurementId: "G-KMYGDT67TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);