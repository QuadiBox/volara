'use client'

import React, { useEffect, useState } from 'react';
import { onSnapshotWithCondition } from '../db/firestoreService';
import { useUser } from "@clerk/nextjs";

const HomeAmountDisplay = () => {
    const [theuser, setTheuser] = useState(null);

    const {user, isLoaded, isSignedIn} = useUser();

    useEffect(() => {
        
        const fetchRequests = onSnapshotWithCondition(
            'workers',
            'id',
            `${user?.id}`,
            (documents) => {
                setTheuser(documents[0]);
            }
        )
        
        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, [isLoaded, isSignedIn]);

    return (
        <h2><img src="/coin.png" alt="coin" /> {theuser?.balance} <span>Volara coin</span></h2>
    )
}

export default HomeAmountDisplay
