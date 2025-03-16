import{ BrowserRouter as Router, Routes, Route, Navigate} from"react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<LoginPage/>} />
        <Route path="/Register" element={<RegisterPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
