import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoggedInHeader from "../components/LoggedInHeader";
import DashboardItem from "../components/DashboardItem";
import { Button } from "@mui/material";
import { TrendingUp } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { format } from "https://cdn.skypack.dev/date-fns";

const zero = { totalSales: 0, totalItemsSold: 0 };

const DashboardPage = () => {
  const { user } = useAuth();
  const [daily, setDaily]     = useState(zero);
  const [monthly, setMonthly] = useState(zero);

  const fetchSales = async () => {
    if (!user) return;

    const todayKey   = `daily-${format(new Date(), "yyyy-MM-dd")}`;
    const monthKey   = `monthly-${format(new Date(), "yyyy-MM")}`;
    const dailyRef   = doc(db, "stores", user.uid, "sales", todayKey);
    const monthlyRef = doc(db, "stores", user.uid, "sales", monthKey);

    const [dSnap, mSnap] = await Promise.all([
      getDoc(dailyRef),
      getDoc(monthlyRef),
    ]);

    const dData = dSnap.exists() ? dSnap.data() : zero;
    const mData = mSnap.exists() ? mSnap.data() : zero;

    setDaily(dData);
    setMonthly(mData);
  };

  useEffect(() => {
    fetchSales();
  }, [user]);

  return (
    <div>
      <LoggedInHeader />
      <div className="w-4/5 mx-auto mt-3">
        <h4 className="text-4xl pb-6">Dashboard</h4>
        <Button onClick={fetchSales}>Refresh</Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardItem
            title="Today's Sales"
            value={`$${daily.totalSales.toFixed(2)}`}
            subtext={`${daily.totalItemsSold} items sold`}
            icon={<TrendingUp size={18} />}
          />
          <DashboardItem
            title="Monthly Sales"
            value={`$${monthly.totalSales.toFixed(2)}`}
            subtext={`${monthly.totalItemsSold} items sold`}
            icon={<TrendingUp size={18} />}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
