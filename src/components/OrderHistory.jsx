import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

export default function ReceivedOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const storeId = user ? user.uid : null;

  useEffect(() => {
    if (!storeId) return;

    const ordersRef = query(
      collection(db, "stores", storeId, "orderHistory"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [storeId]);

  return (
    <>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={2}>
        {orders.map((order) => (
          <Grid
            key={order.id}
            sx={{
              gridColumn: {
                xs: "span 4",
                sm: "span 4",
                md: "span 4",
              },
            }}
          >
            <Card
              variant="outlined"
              sx={{
                height: 200,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">
                  Total Price: {order.total}€
                </Typography>
                <Typography variant="h6">
                  Name: {order.businessName || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.timestamp
                    ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                    : "No timestamp"}
                </Typography>
              </CardContent>
              <CardContent>
                <Button size="small" onClick={() => setSelectedOrder(order)}>
                  View More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography variant="body1">
                Name: {selectedOrder.businessName || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedOrder.timestamp
                  ? new Date(
                      selectedOrder.timestamp.seconds * 1000
                    ).toLocaleString()
                  : "No timestamp"}
              </Typography>
              {selectedOrder.items?.length ? (
                selectedOrder.items.map((item) => (
                  <Typography key={item.id}>
                    {item.name} - {item.price}€ x {item.quantity}
                  </Typography>
                ))
              ) : (
                <Typography>No items in this order</Typography>
              )}
              <Typography sx={{ mt: 2 }}>
                Total Price: {selectedOrder.total}€
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
