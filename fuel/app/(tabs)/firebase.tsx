// Import necessary functions from Firebase SDK
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwY1SjwekStYLEk0eU5m3B6aDbGo_hPwU",
  authDomain: "fuel-31f11.firebaseapp.com",
  projectId: "fuel-31f11",
  storageBucket: "fuel-31f11.appspot.com",
  messagingSenderId: "253208976846",
  appId: "1:253208976846:web:cfee02c6e21a7f03809f9f",
  measurementId: "G-VDDKFS61BC"
};

// Initialize Firebase and the Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
