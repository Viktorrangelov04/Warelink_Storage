import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getCategoriesByStoreId = async (storeId) => {
  const q = query(
    collection(db, "categories"),
    where("storeId", "==", storeId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};