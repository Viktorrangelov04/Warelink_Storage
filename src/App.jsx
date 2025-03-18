import{ BrowserRouter as Router, Routes, Route, Navigate} from"react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"

function App() {
  return (
    
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
        <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>}/>
        <Route path="/Orders" element={<ProtectedRoute><OrdersPage/></ProtectedRoute>}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
