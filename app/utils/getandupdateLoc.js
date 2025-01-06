import { fetchDocumentWithCondition, updateDocument } from "../db/firestoreService";

export async function getandupdateLoc(vlad) {
    if (vlad) {
        
        const dbCurrentUser = await fetchDocumentWithCondition('workers', "id", `${vlad}`);
        
        const fecthIPLocation = async (vlad) => {
            let locData;
    
            try {
                const response = await fetch('/api/get-location'); // Defaults to GET
                const data = await response.json();
                    
                if (data?.city) {
                    locData = data
                } else {
                    if (vlad) {
                        locData = dbCurrentUser?.locationData
                    } else {
                        locData = {
                            ip: "197.211.53.80",
                            city: "Lagos",
                            region: "Lagos",
                            country: "NG",
                            loc: "6.4541,3.3947",
                            org: "AS37148 Globacom Limited",
                            timezone: "Africa/Lagos",
                            dummy: true
                        }
                    }
                }
    
                await updateDocument('workers', dbCurrentUser?.docId, {locationData: {...locData, date: Date.now()}})
        
                return {...locData, date: Date.now()};
                
            } catch (error) {
                console.error("Error fetching data:", error.message);
                throw error; // Re-throw the error for the caller to handle
            }
        }
    
        try {
            if (dbCurrentUser?.locationData) {
                const { locationData } = dbCurrentUser;
                const savedDate = new Date(locationData.date);
                const today = new Date();
    
                if (
                    savedDate.getDate() === today.getDate() &&
                    savedDate.getMonth() === today.getMonth() &&
                    savedDate.getFullYear() === today.getFullYear()
                ) {
                    // Return cached location data if it's for today
                    return locationData;
                } else {
                    const newLocation = await fecthIPLocation(true);
                    
                    return newLocation;
                }
            } else {
                const newLocation = await fecthIPLocation();
                return newLocation;
            }
            
        } catch (error) {
            console.error("Error fetching data:", error.message);
            throw error; // Re-throw the error for the caller to handle
        }
    }
}