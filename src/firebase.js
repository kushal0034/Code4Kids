// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuZhroBZxQjPa90g4e7N3uyEZB3ylORXo",
  authDomain: "code4kids-6d0b8.firebaseapp.com",
  projectId: "code4kids-6d0b8",
  storageBucket: "code4kids-6d0b8.firebasestorage.app",
  messagingSenderId: "890917379223",
  appId: "1:890917379223:web:1907914a205d144ec79dd2",
  measurementId: "G-ZBHJ6SS4Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);