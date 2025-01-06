'use client'
import { useEffect, useState } from "react";
import { getandupdateLoc } from "../utils/getandupdateLoc";
import { useUser } from "@clerk/nextjs";
import { onSnapshotWithCondition, onSnapshotWithoutCondition, updateDocument } from "@/app/db/firestoreService";
import Unittodo from "./Unittodo";
import Link from "next/link";



const Todos = ({ isTask, isRegion }) => {
    const [locData, setLocData] = useState(null);
    const [requestsList, setRequestsList] = useState([]);
    const [activitiesList, setactivitiesList] = useState([]);
    const [todoType, settodoType] = useState('');
    const [tapType, setTapType] = useState('city');

    const { isLoaded, isSignedIn, user } = useUser();

    const filteredRequest = requestsList.filter((elem) => elem?.locationData?.country === locData?.country && elem?.status === "active"); 

    const formatPlanData = (inputArray) => {
        // Initialize the resulting array
        const formattedArray = [];
    
        // Loop through each object in the input array
        inputArray.forEach(item => {
            const { plan, platform, planData, u_id, order_id, links, docId } = item;
    
            // Loop through the keys of the planData object
            for (const [key, value] of Object.entries(planData)) {
                // Check if the value is not zero or an empty string
                if (value !== 0 && value !== "") {
                    // Push the formatted object to the resulting array
                    formattedArray.push({
                        plan,
                        platform,
                        engagement: key,
                        count: value,
                        u_id,
                        order_id,
                        link: links[key],
                        docId
                    });
                }
            }
        });
    
        return formattedArray;
    }

    const formattedList = formatPlanData(filteredRequest);

    const filterArray = (array, filterString) => {
        if (isRegion) {
            return isRegion
              ? array.filter(item => item?.platform === isRegion)
              : array;
        } else {
            return filterString
              ? array.filter(item => item?.engagement === filterString)
              : array;
        }
    }

    const todoTypeFilter = filterArray(formattedList, todoType);

    const filterTasksForToday = (tasks) => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();
      
        return tasks.filter(task => task.date >= startOfDay && task.date < endOfDay);
    };

    const todayTasks = filterTasksForToday(activitiesList);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                if (user?.id !== undefined) {
                    const response = await getandupdateLoc(`${user?.id}`);
                    setLocData(response);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
      
        // Call the async function
        fetchLocation();
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
    
        const fetchRequests = onSnapshotWithCondition(
            'activities',
            'type',
            'task',
            (documents) => {
                setactivitiesList(documents)
            }
        )
        
        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, []);

    // Monitor activitiesList for changes and check for completion
    useEffect(() => {
        requestsList.forEach(async (item) => {
            const { planData, progress, docId, status } = item;

            // Check if the request is completed
            const isCompleted =
                progress.likes.length === planData.likes &&
                progress.reposts.length === planData.reposts &&
                progress.comments.length === planData.comments &&
                progress.follows.length === planData.follows &&
                progress.shares.length === planData.shares 

            if (isCompleted && status !== "completed") {
                try {
                    // Update the status to "completed"
                    await updateDocument("requests", docId, { status: "completed" });
                    console.log(`Activity ${docId} marked as completed.`);
                } catch (error) {
                    console.error(`Error updating activity ${docId}:`, error);
                }
            }
        });
    }, [requestsList]); // Dependency on requestsList

    useEffect(() => {
    
        const fetchRequests = onSnapshotWithoutCondition(
            'requests',
            (documents) => {
                setRequestsList(documents)
            }
        )
        
        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, []);



    return (
        <>  
            {
                isTask && !isRegion && (
                    <div className="tapregionCntn">
                        <button className={`${tapType === "city" && 'active'}`} onClick={() => {setTapType('city')}} type="button">City Tap</button>
                        <button className={`${tapType === "region" && 'active'}`} onClick={() => {setTapType('region')}} type="button">Region Tap</button>
                    </div>
                )
            }
            <div className="todosSect">
                {
                    !isTask  && !isRegion && (
                        <div className="heading">
                            <button className={`${todoType === "" && 'active'}`} onClick={() => {settodoType('')}} type="button">New</button>
                            <button className={`${todoType === "likes" && 'active'}`} onClick={() => {settodoType('likes')}} type="button">Likes</button>
                            <button className={`${todoType === "reposts" && 'active'}`} onClick={() => {settodoType('reposts')}} type="button">Reposts</button>
                            <button className={`${todoType === "comments" && 'active'}`} onClick={() => {settodoType('comments')}} type="button">Comments</button>
                            <button className={`${todoType === "follows" && 'active'}`} onClick={() => {settodoType('follows')}} type="button">Follows</button>
                        </div>
                    )
                }
                
                { 
                    tapType === "city" ? (
                        todoTypeFilter?.length > 0 ? (
                            todoTypeFilter?.map((elem, idx) =>  {
                                const mactchingActivity = activitiesList.find(
                                    item => item?.engagement === elem?.engagement && item?.order_id === elem?.order_id
                                )
    
                                if (mactchingActivity) {
                                    return null
                                } else {
                                    return (
                                        <Unittodo key={`unitTodoxoxo${elem.order_id * Math.random()}`} elem={elem} todayTasks={todayTasks}></Unittodo>
                                    )
                                }
                            }
                            )
                        ) : (
                            <div className="emptyDisplayCntn">
                                <h2>No tasks currently availabe in your region</h2>
                            </div>
                        )
                    ) : (
                        <div className="regionTapCntn">
                            <Link href={"/webapp/tasks/Twitter"} style={{backgroundImage: `linear-gradient(to top, #0a080729, #0a0807c2), url(/twitter_bg.png)`}}>
                                <h2>Twitter</h2>
                            </Link>
                            <Link href={"/webapp/tasks/Linkedin"} style={{backgroundImage: `linear-gradient(to top, #0a080729, #0a0807c2), url(/linkedin_bg.png)`}}>
                                <h2>LinkedIn</h2>
                            </Link>
                            <Link href={"/webapp/tasks/Instagram"} style={{backgroundImage: `linear-gradient(to top, #0a080729, #0a0807c2), url(/instagram_bg.png)`}}>
                                <h2>Instagram</h2>
                            </Link>
                        </div>
                    )
                }



            </div>
        </>
    )
}

export default Todos
