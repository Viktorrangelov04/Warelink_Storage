import {useState} from "react";

function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login with", email, password);
    }

    return(
        <form onSubmit={handleLogin} className="bg-white p-6 shadow-md rounded-lg w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) =>setEmail(e.targetValue)} 
            className="w-full p-2 mb-3 border border-gray-300 rounded-md"/>
        
            <input type="password" placeholder="Password" value={email} onChange={(e) =>setPassword(e.targetValue)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"/>   

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Log in</button>     
        </form>
    )
}

export default LoginForm;