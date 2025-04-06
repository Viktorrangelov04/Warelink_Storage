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

    const snapshot=await getDocs(q)

    if(snapshot.empty){
        return await addDoc(productCollection, {
            ...data,
            nameCleaned: cleanedName,
        });
    }else{
        const docRef = doc(db, "products", snapshot.docs[0].id)
        const existing = snapshot.docs[0].data();

        return await updateDoc(docRef, {
            quantity:existing.quantity + data.quantity,
            price: data.price,
        })
    }
}

export async function getProducts(){
    const snapshot = await getDocs(productCollection);
    return snapshot.docs.map(doc =>({id: doc.id, ...doc.data()}));
}