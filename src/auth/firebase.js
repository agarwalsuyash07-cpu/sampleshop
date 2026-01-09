import { initializeApp } from "firebase/app"; // Firebase app initialization
import { getAuth } from "firebase/auth"; // Firebase auth functions
import { getFirestore } from "firebase/firestore"; // Firebase firestore functions
const firebaseConfig = { //my personal fireabse details
  apiKey: "AIzaSyA-pQ7UU3zKhpvk061mPy_pt72fqKedAVw",
  authDomain: "sampleshop-f336a.firebaseapp.com",
  projectId: "sampleshop-f336a",
  storageBucket: "sampleshop-f336a.firebasestorage.app",
  messagingSenderId: "1008242017204",
  appId: "1:1008242017204:web:68446db5aad4dace7ce8e1",
  measurementId: "G-QPKVXD4YC5"
};
const app = initializeApp(firebaseConfig); // Initialize Firebase app
export const db = getFirestore(app); // Initialize Firestore database
export const auth = getAuth(app); // Initialize Firebase authentication
