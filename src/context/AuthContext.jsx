import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        console.log("onAuthStateChanged is running...");
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Firebase detected user change:", currentUser);
            if (currentUser) {
                localStorage.setItem("user", JSON.stringify(currentUser));
                setUser(currentUser);
            } else {
                localStorage.removeItem("user");
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("user", JSON.stringify(userCredentials.user));
            setUser(userCredentials.user);
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            localStorage.setItem("user", JSON.stringify(userCredentials.user));
            setUser(userCredentials.user);
        } catch (error) {
            console.error("Registration failed:", error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    const value = useMemo(() => ({ user, login, register, logout }), [user]);

    if (loading) {
        return <h1>Loading...</h1>; // Prevents app from rendering before Firebase finishes loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
