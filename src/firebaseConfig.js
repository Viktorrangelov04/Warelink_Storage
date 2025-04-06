import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB3BhVOReju5IQ6_R2GAy36CdkEJ6zaOI0",
    authDomain: "astral-bit-450012-k3.firebaseapp.com",
    projectId: "astral-bit-450012-k3",
    storageBucket: "astral-bit-450012-k3.firebasestorage.app",
    messagingSenderId: "151996753339",
    appId: "1:151996753339:web:09943107f7ff023df1109e",
    measurementId: "G-L575MM1Z8Q"
  };

const app = initializeApp(firebaseConfig);

export const auth= getAuth(app);
export const db= getFirestore(app);
export default app;