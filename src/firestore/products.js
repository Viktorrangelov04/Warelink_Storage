import { collection,  addDoc, getDocs, query, where, updateDoc, doc} from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { cleanProductName } from "../utils.js";

const productCollection= collection(db, "products");

export async function addProduct(data) {
    const cleanedName = cleanProductName(data.name);
  
    const q = query(
      productCollection,
      where("storeId", "==", data.storeId),
      where("nameCleaned", "==", cleanedName)
    );
  
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) {
      return await addDoc(productCollection, {
        ...data,
        nameCleaned: cleanedName,
      });
    } else {
      const docRef = doc(db, "products", snapshot.docs[0].id);
      const existing = snapshot.docs[0].data();
  
      const updatedFields = {
        quantity: existing.quantity + data.quantity,
        updatedAt: new Date(),
      };
  
      if (data.price !== undefined && data.price !== null) {
        updatedFields.price = data.price;
      }
  
      return await updateDoc(docRef, updatedFields);
    }
  }
  

export async function getProducts(){
    const snapshot = await getDocs(productCollection);
    return snapshot.docs.map(doc =>({id: doc.id, ...doc.data()}));
}

export async function deleteProduct(id) {
  const productRef = doc(db, "products", id);
  return await deleteDoc(productRef);
}

export async function updateProduct(product) {
  const productRef = doc(db, "products", product.id);
  return await updateDoc(productRef, {
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    updatedAt: new Date()
  });
}


