import {useState, useEffect} from "react";
import LoggedInHeader from "../components/LoggedInHeader";
import { useStoreLogo } from "../firestore/logo";
import { getUserDetails }  from "../firestore/userDetails";

export default function ProfilePage() {
    const [userDetails, setUserDetails] = useState([])
    const logoUrl = useStoreLogo();

    useEffect(() =>{
      async function loadUserDetails() {
      const details = await getUserDetails();
      console.log("✅ User details fetched:", details);
      setUserDetails(details);
    }
    loadUserDetails();
  }, []);
    

return(
    <div>
    <LoggedInHeader/>
    <div className="w-4/5 h-full flex mx-auto border-black">
    {logoUrl ? (
        <img src={logoUrl} alt="Store Logo" className="w-24 h-24 border border-black mt-12" />
      ) : (
        <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full" />
      )}
      <div className="ml-4 mt-4 text-2xl">
        <p>storeName: {userDetails.storeName} </p>
        <p>businessName: {userDetails.businessName}</p>
        <p>EIK: {userDetails.eik}</p>
        <p>ZDDS:{userDetails.zdds} </p>
        <p>MOL:{userDetails.mol} </p>
        <p>Address:{userDetails.address}</p>
      </div>
        
    </div>
    </div>
    
)
}