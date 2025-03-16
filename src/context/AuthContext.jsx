import {createContext, useContext, useEffect, useState} from "react";
import {Auth} from "../firebaseConfig";
import {onAuthStateChanged} from "firebase/auth";

const AuthContext= createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] =useState(null);

    useEffect(()=>{
        const unsubscribe  = onAuthStateChanged(Auth, (currentUser)=>{
            setUser(currentUser);
        })
        return ()=>unsubscribe();
    }, []);
        const logout = async() =>{
            await signOut(auth);
        };
    
    return (
        <authContext.Provider value= {{user, logout}}>
            {children}
        </authContext.Provider>
    )
};

export const useAuth = () =>useContext(AuthContext);
