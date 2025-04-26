import { auth, db } from "../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";

export async function getUserDetails() {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  const storeRef = doc(db, "stores", user.uid);
  const storeSnap = await getDoc(storeRef);

  if (!docSnap.exists()) return null;

  const userData = docSnap.data();

  if (storeSnap.exists()) {
    const storeData = storeSnap.data();
    userData.storeName = storeData.storeName;
  }

  return userData;
}
