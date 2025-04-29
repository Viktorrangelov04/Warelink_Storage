import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

import LoggedInHeader from "../components/LoggedInHeader";
import { useStoreLogo } from "../firestore/logo";
import { getUserDetails } from "../firestore/userDetails";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [marginInput, setMarginInput] = useState("");
  const logoUrl = useStoreLogo();

  const editableFields = [
    { key: "storeName", label: "Store Name" },
    { key: "businessName", label: "Business Name" },
    { key: "eik", label: "EIK" },
    { key: "zdds", label: "ZDDS" },
    { key: "mol", label: "MOL" },
    { key: "address", label: "Address" },
  ];

  useEffect(() => {
    async function loadUserDetails() {
      const details = await getUserDetails();
      setUserDetails(details);

      setInputValues({
        businessName: details?.businessName || "",
        eik: details?.eik || "",
        zdds: details?.zdds || "",
        mol: details?.mol || "",
        address: details?.address || "",
      });
      setMarginInput(
        details?.margin !== undefined ? (details.margin * 100).toFixed(0) : "30"
      );
    }
    loadUserDetails();
  }, []);

  const handleSaveField = async (fieldKey) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { [fieldKey]: inputValues[fieldKey] });

      setUserDetails((prev) => ({
        ...prev,
        [fieldKey]: inputValues[fieldKey],
      }));
      setIsEditing((prev) => ({ ...prev, [fieldKey]: false }));
    } catch (error) {
      console.error(`❌ Error updating ${fieldKey}:`, error);
    }
  };

  const handleMarginSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const storeRef = doc(db, "stores", user.uid);
      const marginNumber = parseFloat(marginInput);

      if (isNaN(marginNumber)) {
        console.error("❌ Invalid margin input");
        return;
      }

      await updateDoc(storeRef, { margin: marginNumber / 100 });

      const storeSnap = await getDoc(storeRef);
      if (storeSnap.exists()) {
        setStoreData(storeSnap.data());
      }

      setIsEditing((prev) => ({ ...prev, margin: false }));
    } catch (error) {
      console.error("❌ Error updating margin:", error);
    }
  };

  return (
    <div>
      <LoggedInHeader />
      <div className="w-4/5 mx-auto pt-8 flex justify-center items-center ">
        <div className="p-4 flex border border-black">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Store Logo"
              className="w-24 h-24 border border-black"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full" />
          )}

          <div className="ml-4  text-2xl">
            {editableFields.map(({ key, label }) => (
              <div key={key} className="mb-4 flex">
                <label className="block font-semibold mr-4">{label}:</label>
                {isEditing[key] ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={inputValues[key]}
                      onChange={(e) =>
                        setInputValues((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="border p-2 rounded"
                      placeholder={userDetails[key] || `Enter ${label}`}
                    />
                    <button
                      onClick={() => handleSaveField(key)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p
                    className="cursor-pointer text-gray-700 hover:underline"
                    onClick={() =>
                      setIsEditing((prev) => ({ ...prev, [key]: true }))
                    }
                  >
                    {userDetails[key] || `No ${label} set (click to edit)`}
                    <img
                      src="/edit.svg"
                      alt="Edit"
                      className="h-4 w-4 inline-block"
                    />
                  </p>
                )}
              </div>
            ))}

            <div className="mb-4 flex">
              <label className="block font-semibold mr-4">Margin:</label>
              {isEditing["margin"] ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={marginInput}
                    onChange={(e) => setMarginInput(e.target.value)}
                    className="border p-2 rounded"
                    placeholder={storeData.margin || "Enter margin"}
                  />
                  <button
                    onClick={handleMarginSave}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p
                  className="cursor-pointer text-gray-700 hover:underline"
                  onClick={() =>
                    setIsEditing((prev) => ({ ...prev, margin: true }))
                  }
                >
                  {storeData.margin !== undefined
                    ? `${(storeData.margin * 100).toFixed(0)}%`
                    : "30%"}
                  <img
                    src="/edit.svg"
                    alt="Edit"
                    className="h-4 w-4 inline-block ml-2"
                  />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
