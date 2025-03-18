import { useAuth } from "../context/AuthContext";
import LoggedInHeader from "../components/LoggedInHeader";
function InventoryPage() {
    const { user } = useAuth();

    return (
        <div>
            <LoggedInHeader/>
            <h1>Inventory</h1>
        </div>
    );
}

export default InventoryPage;
