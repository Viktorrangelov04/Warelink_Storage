import { Link } from "react-router-dom";
import { useState} from "react";
import { auth } from "../firebaseConfig";
import { useNavigate} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "../components/LoginForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleLogin=async (email, password) => {
    try{
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard")
    }catch{
      setError("Invalid email or password");
      console.error(error);
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <LoginForm onLogin={handleLogin} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 underline">
          Register
        </Link>
      </p>
    </div>
    <Footer />
    </div>
  );
}

export default LoginPage;
