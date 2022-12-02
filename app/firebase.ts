// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKZFmlShuz8ke2VFqo1j4fpxIMhmkcl20",
    authDomain: "todo-9bc1d.firebaseapp.com",
    projectId: "todo-9bc1d",
    storageBucket: "todo-9bc1d.appspot.com",
    messagingSenderId: "645188394431",
    appId: "1:645188394431:web:a107538348db5be042950a",
    databaseURL: "https://todo-9bc1d-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
