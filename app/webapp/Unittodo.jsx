'use client'

import { useState } from "react"
import { arrayUnion } from "firebase/firestore";
import { fetchDocumentWithCondition, addDocument, updateDocument, fetchAllDocuments } from "../db/firestoreService";
import { useUser } from "@clerk/nextjs";

const Unittodo = ({ elem, todayTasks }) => {
    const [showVerify, setShowVerfiy] = useState(false);

    const unitTaskPrice = {
        likes: 0.5,
        comments: 0.5,
        follows: 1,
        shares: 0.8,
        reposts: 0.8
    };

    const {user} = useUser();

    /**
     * Add a string to a specific array field in a Firestore document.
     * 
     * @param {string} collectionName - The name of the collection.
     * @param {string} documentId - The ID of the document to update.
     * @param {string} engagementField - The specific engagement field to update (e.g., "progress.likes").
     * @param {string} value - The value to add to the array.
     */
    const addToEngagementArray = async (collectionName, documentId, engagementField, value) => {
        try {
            await updateDocument(collectionName, documentId, {
                [engagementField]: arrayUnion(value),
            });
            console.log(`${value} added to ${engagementField} successfully.`);
        } catch (error) {
            console.error(`Error updating ${engagementField}:`, error);
        }
    };

    const handleVerifyTaskAction = async () => {
        
        const userData = await fetchDocumentWithCondition('workers', 'id', `${user?.id}`);
        const todb = {...elem, date: Date.now(), type: 'task', amount: unitTaskPrice[elem?.engagement], w_id: `${user?.id}`}
        const fieldPath = `progress.${elem?.engagement}`;
        if (userData) {
            console.log('starting db data updates and all');
            await addDocument('activities', todb);
            await addToEngagementArray('requests', `${elem?.docId}`, fieldPath, `${elem?.u_id}`)
            if (todayTasks?.length >= 4) {
                await updateDocument('workers', userData?.docId, {balance: userData?.balance + unitTaskPrice[elem?.engagement]})
            }
        }
    }


    return (
        <div  className="unitTodoCard">
            <img src={`/${elem.engagement}.svg`} alt={ `${elem.engagement} icon`} />
            <div className="center">
                <h3>
                    {
                        elem.engagement === "subscribers"
                        ? elem.engagement.slice(0, -2) // Remove last two letters for 'subscribers'
                        : elem.engagement === "views"
                        ? "Watch video" // Replace 'views' with 'Watch video'
                        : elem.engagement.endsWith("s")
                        ? elem.engagement.slice(0, -1) // Remove last letter if ends with 's'
                        : elem.engagement
                    }
                </h3>
                <p>{elem.link}</p>
            </div>
            {
                showVerify ? (
                    <button onClick={() => {handleVerifyTaskAction()}} className="fancyCta" type="button">Verify</button>
                ) : (
                    <a onClick={() => {setShowVerfiy(true)}} className="fancyCta" href={elem?.link.startsWith('https://') ? elem?.link : `https://${elem?.link}`} target="_blank" rel="noopener noreferrer">Go</a>
                )
            }
        </div>
    )
}

export default Unittodo
