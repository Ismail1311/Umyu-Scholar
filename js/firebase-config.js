// js/firebase-config.js

// 1. Import all Firebase functions we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
    getFirestore, 
    collection, addDoc, getDocs, getDoc, 
    query, where, orderBy, limit, startAfter, 
    doc, updateDoc, arrayUnion, arrayRemove, 
    setDoc, deleteDoc, onSnapshot, serverTimestamp,
    increment  // <-- ADDED increment
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    reload
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// 2. YOUR FIREBASE CONFIG (Replace with your actual keys)
const firebaseConfig = {
    apiKey: "AIzaSyACBhEL52Q6qSRJdsCMUkGqHYKNH340cz0",
    authDomain: "umyusholar.firebaseapp.com",
    projectId: "umyusholar",
    storageBucket: "umyusholar.firebasestorage.app",
    messagingSenderId: "157171666762",
    appId: "1:157171666762:web:da60c86387df9e8f4ffbb3",
    measurementId: "G-KW2ZMEHBXQ"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// 5. EXPORT everything (ALL functions are now included)
export { 
    db, 
    auth, 
    // Firestore
    collection, addDoc, getDocs, getDoc, 
    query, where, orderBy, limit, startAfter, 
    doc, updateDoc, arrayUnion, arrayRemove, 
    setDoc, deleteDoc, onSnapshot, serverTimestamp,
    increment,  // <-- NOW EXPORTED
    // Auth
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    reload
};