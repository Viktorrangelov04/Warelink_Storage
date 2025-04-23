import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DefaultAvatar from "../assets/avatar.svg";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [businessName, setBusinessName] = useState("");

    const { user, logout } = useAuth();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchBusinessName = async () => {
            if (user?.uid) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setBusinessName(userDoc.data().businessName || "");
                }
            }
        };

        fetchBusinessName();
    }, [user]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                <img className="size-12 rounded-full cursor-pointer" src={DefaultAvatar} alt="avatar" />
            </button>

            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md">
                    <ul className="text-sm">
                        {businessName && (
                            <li className="px-4 py-2 font-medium text-gray-700 border-b border-gray-200 text-center">
                                {businessName}
                            </li>
                        )}
                        <li>
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
