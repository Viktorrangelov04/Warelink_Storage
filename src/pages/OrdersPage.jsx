import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Typography } from "@mui/material";
import LoggedInHeader from "../components/LoggedInHeader";

export default function OrdersPage() {
  return (
    
    <div>
      <LoggedInHeader />
      <div className="w-4/5 mx-auto mt-3">
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography> 

        
        <div className="flex gap-4 mb-6">
          <NavLink to="/orders" end>Received Orders</NavLink>
          <NavLink to="/orders/history">Order History</NavLink>
        </div>

        
        <Outlet /> 
      </div>
   </div> 
    
  );
}
