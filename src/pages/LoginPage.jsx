import { Link } from "react-router-dom";
import { useState} from "react";
import { useEffect} from "react";
import { useNavigate} from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(()=>{
    if (user){
      navigate("/dashboard");
    }
  }, [user, navigate])

  if(user){
    return <Navigate to="/dashboard"/>
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <LoginForm/>
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
