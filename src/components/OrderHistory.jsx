import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function ReceivedOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const storeId = user ? user.uid : null;

  useEffect(() => {
    if (!storeId) {
      console.warn("No storeId found, skipping Firestore query.");
      return;
    }

    const ordersRef = collection(db, 'stores', storeId, 'orderHistory');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [storeId]);

  return (
    <Grid container spacing={2}>
      {orders.map(order => (
        <Grid item xs={12} sm={6} md={4} key={order.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">
                Name: {order.businessName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.timestamp
                  ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp available"}
              </Typography>

              {order.items && order.items.length > 0 ? (
                order.items.map(item => (
                  <div key={item.id}>
                    <Typography variant="subtitle1">
                      {item.name} - {item.price}лв. x {item.quantity}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2">No items in this order</Typography>
              )}

              <Typography variant="body2">
                Total Price: {order.total}лв.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
