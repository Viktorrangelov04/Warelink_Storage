import { useState } from "react";
import { auth } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {error && <p className="text-red-500">{error}</p>}
        <RegisterForm onRegister={handleRegister} />
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
