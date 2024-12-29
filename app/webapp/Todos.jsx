'use client'
import { useEffect, useState } from "react";
import { getandupdateLoc } from "../utils/getandupdateLoc";
import { useUser } from "@clerk/nextjs";


const Todos = () => {
    const [data, setData] = useState(null);

    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await getandupdateLoc(`${user?.id}`);
                setData(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
      
        // Call the async function
        fetchLocation();
    }, [isLoaded, isSignedIn]);
    return (
        <div className="todosSect">
            <div className="heading">
                <button className='active' type="button">New</button>
                <button type="button">Likes</button>
                <button type="button">Reposts</button>
                <button type="button">Comments</button>
                <button type="button">Views</button>
                <button type="button">Saves</button>
                <button type="button">Follows</button>
                <button type="button">Subscribers</button>
            </div>

            <div className="unitTodoCard">
                
            </div>
        </div>
    )
}

export default Todos
