import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBnqpYjww5dBL02xSdQWiLC1JgtE-lAzL0",
    authDomain: "warelink-warehouse-manager.firebaseapp.com",
    projectId: "warelink-warehouse-manager",
    storageBucket: "warelink-warehouse-manager.firebasestorage.app",
    messagingSenderId: "326976324328",
    appId: "1:326976324328:web:d1cd1d7efd88b5b2773f5d",
    measurementId: "G-1MQ7N8F102"
}

const app = initializeApp(firebaseConfig);

export const auth= getAuth(app);
export const db= getFirestore(app);
export default app;