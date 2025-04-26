import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export function useStoreLogo() {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function loadLogo() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const storeQuery = query(collection(db, 'stores'), where('ownerId', '==', user.uid));
        const storeSnapshot = await getDocs(storeQuery);

        if (!storeSnapshot.empty) {
          const storeData = storeSnapshot.docs[0].data();
          if (storeData.logoUrl) {
            setLogoUrl(`${storeData.logoUrl}&t=${Date.now()}`); 
          }
        }
      } catch (error) {
        console.error('❌ Error loading store logo:', error);
      }
    }

    loadLogo();
  }, []);

  return logoUrl;
}
