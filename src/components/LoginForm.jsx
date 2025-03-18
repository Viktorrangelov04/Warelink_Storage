import { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const { login } = useAuth();
    const navigate=useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <form onSubmit={handleLogin} className="bg-white p-6 shadow-md rounded-lg w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-3 border border-gray-300 rounded-md" required />

            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md" required />

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                Log in
            </button>
        </form>
    );
}

export default LoginForm;
