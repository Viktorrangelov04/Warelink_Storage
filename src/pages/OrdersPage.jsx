import { useAuth } from "../context/AuthContext";
import LoggedInHeader from "../components/LoggedInHeader";
function OrdersPage() {
    const { user } = useAuth();

    return (
        <div>
            <LoggedInHeader/>
            <h1>Orders</h1>
        </div>
    );
}

export default OrdersPage;
