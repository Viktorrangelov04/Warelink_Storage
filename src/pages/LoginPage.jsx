import { Link } from "react-router-dom";
import { useState, useEffect} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LoginPage() {
  const { user } = useAuth();
  const Navigate = useNavigate();
  
  useEffect(()=>{
    if (user){
      Navigate("/dashboard");
    }
  }, [user, Navigate])

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
