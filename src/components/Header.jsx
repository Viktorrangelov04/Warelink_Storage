import {Link} from "react-router-dom";

function Header(){
    return (
        <header className="bg-blue-600 text-white py-4 px-6"> 
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Warelink</h1>
                <nav>
                    <Link to="/login" className="mr-4 hover:underline">Login</Link>
                    <Link to="/register" className="hover:underline">Register</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;