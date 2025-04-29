import { Link } from "react-router-dom";
import ProfileMenu from './ProfileMenu';

function LoggedInHeader() {
    return(
        <header className="border-b-1">
            <div className="w-4/5 mx-auto flex align-center justify-between">
                <div className="flex">
                    <img className="size-12 " src="/StorageLogo.png" alt="logo"/>
                    <nav className="flex items-center space-x-4 ml-4">
                        <Link to = "/dashboard" className="p-2 rounded-md hover:bg-gray-200">Dashboard</Link>
                        <Link to = "/inventory" className="p-2 rounded-md hover:bg-gray-200">Inventory</Link>
                        <Link to = "/orders" className="p-2 rounded-md hover:bg-gray-200">Orders</Link>
                    </nav>
                </div>
                <div>
                    <ProfileMenu />
                </div>
            </div>
        </header>
    )
}

export default LoggedInHeader;