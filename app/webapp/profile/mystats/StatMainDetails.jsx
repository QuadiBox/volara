'use client'
import { useEffect, useState } from "react";
import { fetchAllDocuments, fetchDocumentsWithCondition, fetchDocumentWithCondition, onSnapshotWithCondition } from "@/app/db/firestoreService";
import { useUser } from "@clerk/nextjs";

const StatMainDetails = () => {
    const [activities, setActivities] = useState([]);
    const [theUser, setTheUser] = useState([]);

    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {

        const fetchRequests = onSnapshotWithCondition(
            'workers',
            'id',
            `${user?.id}`,
            (documents) => {
                setTheUser(documents[0]);
            }
        )

        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        const fetchUser = async () => {
            // const activities = await fetchDocumentsWithCondition('activities', 'w_id', `${user?.id}`);
            const activities = await fetchAllDocuments('activities');

            setActivities(activities);
        }

        // Cleanup the listener on component unmount
        return () => fetchUser();
    }, [isLoaded, isSignedIn]);

    // Function to calculate weekly summary
    function calculateWeeklySummary(data) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

        // Calculate the start of the week (Sunday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDay);
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate the end of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Initialize counts for each day of the week
        const weekCounts = [
            { day: 'Sun', count: 0 },
            { day: 'Mon', count: 0 },
            { day: 'Tue', count: 0 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 0 },
            { day: 'Fri', count: 0 },
            { day: 'Sat', count: 0 },
        ];

        // Process each item in the input array
        data.forEach(item => {
            const itemDate = new Date(item.date);
            if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
                const itemDay = itemDate.getDay(); // Get the day index (0 = Sunday)
                weekCounts[itemDay].count += 1; // Increment the count for the corresponding day
            }
        });

        // Calculate max and min counts
        const counts = weekCounts.map(day => day.count);
        const max = Math.max(...counts);
        const min = Math.min(...counts);

        // Return the result object
        return {
            max,
            min,
            dataArray: weekCounts
        };
    }

    // Function to calculate engagement counts by plan
    function calculateEngagementCounts(data) {
        const output = {};
    
        data.forEach(item => {
        const key = item.engagement;
        if (output[key]) {
            output[key] += 1; // Increment the count if the key already exists
        } else {
            output[key] = 1; // Initialize the count if the key does not exist
        }
        });
    
        return output;
    }

    // Function to calculate total data occurrences in the current week
    function calculateTotalOccurrences(data) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
    
        // Calculate the start of the week (Sunday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDay);
        startOfWeek.setHours(0, 0, 0, 0);
    
        // Calculate the end of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
    
        // Count occurrences within the current week
        const totalOccurrences = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
        }).length;
    
        return totalOccurrences;
    }



    // Execute the function
    const weeklySummary = calculateWeeklySummary(activities);
    const engagementCounts = calculateEngagementCounts(activities);
    const totalOccurrences = calculateTotalOccurrences(activities);

    return (
        <section className="curentCntn">
            <div className="statNameDisplay">
                <h1>Hello {user?.fullName ? user?.fullName : 'John Doe'}👋</h1>
                <p>Here are your overall stats</p>
            </div>
            <div className="statsGrid">
                <div className="leftGrid">
                    <div className="topChartCntn utilFancyClass">
                        <div className="theChart">
                            {
                                weeklySummary?.dataArray?.map((elem, idx) => (
                                    <div key={`${idx * Math.random()}`} className="unitBar">
                                        <span style={{height: `calc(${(elem?.count / weeklySummary?.max).toFixed(2)} * 150px)`}}></span>
                                        <p>{elem?.day}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <h3>Activity this week</h3>
                    </div>
                    <div className="refCntn utilFancyClass">
                        <p>Total Referred: <span>0</span></p>
                    </div>
                </div>
                <div className="rightGrid">
                    <div className="top utilFancyClass">
                        <img src="/coin.png" alt="coin" />
                        <h2>{totalOccurrences} <span>Completion</span></h2>
                        <p>Task completed this week</p>
                    </div>
                    <div className="bottom utilFancyClass">
                        <img src="/coin.png" alt="coin" />
                        <h2>{theUser?.balance} <span>Volara coin</span></h2>
                        <p>Overall earning</p>
                    </div>
                </div>
            </div>
            <div className="overallTaskGrandCntn">
                <h2>Overall Tasks</h2>

                <div className="overallTaskCntn">
                    <div className="unitStatTasks">
                        <img src="/likes.svg" alt="likes ison" />
                        <h3>Likes</h3>
                        <p>{engagementCounts?.likes ? engagementCounts?.likes : "0"}</p>
                    </div>
                    <div className="unitStatTasks">
                        <img src="/comments.svg" alt="likes ison" />
                        <h3>Comments</h3>
                        <p>{engagementCounts?.comments ? engagementCounts?.comments : "0"}</p>
                    </div>
                    <div className="unitStatTasks">
                        <img src="/reposts.svg" alt="likes ison" />
                        <h3>Reposts</h3>
                        <p>{engagementCounts?.reposts ? engagementCounts?.reposts : "0"}</p>
                    </div>
                    <div className="unitStatTasks">
                        <img src="/follows.svg" alt="likes ison" />
                        <h3>Follows</h3>
                        <p>{engagementCounts?.follows ? engagementCounts?.follows : "0"}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StatMainDetails
