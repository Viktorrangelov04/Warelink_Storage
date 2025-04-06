import { useAuth } from "../context/AuthContext";
import LoggedInHeader from "../components/LoggedInHeader";
import DashboardItem from '../components/DashboardItem'
import { TrendingUp, Package } from 'lucide-react'

const DashboardPage = () => {
    const { user } = useAuth();
    return (
        <div><LoggedInHeader/>
      <div className="w-4/5 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardItem
          title="Today's Sales"
          value="$430"
          subtext="22 items sold"
          icon={<TrendingUp size={18} />}
          onClick={() => openDetailModal('today')}
        />
  
        <DashboardItem
          title="Low Stock"
          value="7 products"
          icon={<Package size={18} />}
          onClick={() => navigateTo('/inventory/low-stock')}
        />
      </div>
      </div>
    )
  }
  export default DashboardPage;