import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem("userUID", user.uid);
    } else {
        localStorage.removeItem("userUID");
    }
});

export async function logout() {
    await signOut(auth);
    localStorage.removeItem("userUID");
    window.location.reload();
}

export async function registerUser(user) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        email: user.email,
        subscription: null, 
        productLimit: 0
    });
}