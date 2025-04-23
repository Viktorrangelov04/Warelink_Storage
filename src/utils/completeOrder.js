import { doc, getDoc, updateDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";
import { db } from "../firebaseConfig";

export async function completeOrder(orderId, storeId) {
  try {
    const orderRef = doc(db, 'stores', storeId, 'receivedOrders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.warn(`⚠️ Order ${orderId} not found in receivedOrders.`);
      return;
    }

    const orderData = orderSnap.data();
    const items = orderData.items || [];

    let totalRevenue = 0;
    let totalItemsSold = 0;

    for (const item of items) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        console.warn(`⚠️ Product ${item.id} not found.`);
        continue;
      }

      const productData = productSnap.data();
      const newQuantity = (productData.quantity || 0) - item.quantity;

      await updateDoc(productRef, {
        quantity: Math.max(newQuantity, 0),
      });

      totalRevenue += (item.price || 0) * item.quantity;
      totalItemsSold += item.quantity;
    }

    const today = new Date();
    const dailyKey = `daily-${format(today, 'yyyy-MM-dd')}`;
    const monthlyKey = `monthly-${format(today, 'yyyy-MM')}`;

    const dailyRef = doc(db, 'stores', storeId, 'sales', dailyKey);
    const monthlyRef = doc(db, 'stores', storeId, 'sales', monthlyKey);

    await Promise.all([
      updateSalesDoc(dailyRef, totalRevenue, totalItemsSold),
      updateSalesDoc(monthlyRef, totalRevenue, totalItemsSold)
    ]);

    const historyRef = doc(db, 'stores', storeId, 'orderHistory', orderId);
    await setDoc(historyRef, orderData);
    await deleteDoc(orderRef);

  } catch (err) {
    console.error(`❌ Failed to complete order ${orderId}:`, err);
  }
}

async function updateSalesDoc(ref, revenue, itemCount) {
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};

  await setDoc(
    ref,
    {
      totalSales: (existing.totalSales || 0) + revenue,
      totalItemsSold: (existing.totalItemsSold || 0) + itemCount,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
