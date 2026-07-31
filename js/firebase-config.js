// ======================================
// Firebase Configuration
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBEGc6CJP8usIgkj9dJ3kpud2_HoucCEQY",
    authDomain: "bsvs-verify.firebaseapp.com",
    projectId: "bsvs-verify",
    storageBucket: "bsvs-verify.firebasestorage.app",
    messagingSenderId: "1005632813828",
    appId: "1:1005632813828:web:0279a79fb02b99f8436e51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

export { db };