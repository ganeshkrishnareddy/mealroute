import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBoGBX9DfsVpAgihUyMPn7Qgh8GcZb_Uyg",
    authDomain: "mealrouteadmin.firebaseapp.com",
    projectId: "mealrouteadmin",
    storageBucket: "mealrouteadmin.firebasestorage.app",
    messagingSenderId: "28799826818",
    appId: "1:28799826818:web:410a9b4a8d93023fb82d9b",
    measurementId: "G-4H2KJLW26Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
