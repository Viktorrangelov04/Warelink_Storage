import { auth, db } from "../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";

export async function getUserDetails() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const storeRef = doc(db, "stores", user.uid);
  const storeSnap = await getDoc(storeRef);

  if (!userSnap.exists()) return null;

  const userData = userSnap.data();

  if (storeSnap.exists()) {
    const storeData = storeSnap.data();
    userData.storeName = storeData.storeName;
  }

  return userData;
}

export async function updateUserDetails(){
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){
        userData = userSnap.data();
    }else{
        return null;
    }
}