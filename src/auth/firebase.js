import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA-pQ7UU3zKhpvk061mPy_pt72fqKedAVw",
  authDomain: "sampleshop-f336a.firebaseapp.com",
  projectId: "sampleshop-f336a",
  storageBucket: "sampleshop-f336a.firebasestorage.app",
  messagingSenderId: "1008242017204",
  appId: "1:1008242017204:web:68446db5aad4dace7ce8e1",
  measurementId: "G-QPKVXD4YC5"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
