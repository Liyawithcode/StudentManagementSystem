// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjlTV97s6KtbbRyThi4HUbukgdHZoMcUI",
    authDomain: "student-management-syste-5b133.firebaseapp.com",
    projectId: "student-management-syste-5b133",
    storageBucket: "student-management-syste-5b133.firebasestorage.app",
    messagingSenderId: "1007124002486",
    appId: "1:1007124002486:web:a89cd5cddf54d3597b5817"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
export { signInWithPopup };
