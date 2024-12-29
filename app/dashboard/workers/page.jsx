'use client'
import { onSnapshotWithoutCondition, updateDocument } from "@/app/db/firestoreService";
import { useState, useEffect } from "react"
// import { useUser } from "@clerk/nextjs";

const page = () => {
    const [totalNum, setTotalNum] = useState(0);

    // this is to show the amount of results increment per page
    let incCount = 50;

    let totalsects = Math.ceil(totalNum / incCount);

    const [currNum, setcurrNum] = useState(50);
    const [showWidget, setshowWidget] = useState(false);

    const [widgetData, setWidgetData] = useState({});

    const [currentshowingBtn, setcurrentshowingBtn] = useState(5);
    const [activeSect, setactiveSect] = useState(1);


    const [requests, setRequests] = useState([]);
    const [allWorkers, setAllWorkers] = useState([]);
    // const [showCount, setshowCount] = useState(3);

    // const { isLoaded, isSignedIn, user } = useUser();

    const filteredList = allWorkers.filter((elem, idx) => idx <= currNum);


    useEffect(() => {

        const fetchRequests = onSnapshotWithoutCondition(
            'requests',
            (documents) => {
                setRequests(documents)
                setTotalNum(documents?.length);
            }
        )
      
        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, []);

    useEffect(() => {

        const fetchClients = onSnapshotWithoutCondition(
            'workers',
            (documents) => {
                setAllWorkers(documents)
            }
        )
      
        // Cleanup the listener on component unmount
        return () => fetchClients();
    }, []);

    
    const handleShownPrev = () => {
        if (currentshowingBtn > 5) {
            setcurrentshowingBtn(prev => prev - 5);
        }
    }

    const handleShownNext = () => {
        if (currentshowingBtn < totalsects) {
            setcurrentshowingBtn(prev => prev + 5);
        }
    }

    const handleShowCurrentSect = (idx) => {
        setcurrNum(50 * (idx + 1));
        setactiveSect(idx + 1);
    }

    const handleSetWidgetValue = (vlad) => {
        setWidgetData(vlad);
        setshowWidget(true);
    }

    const validateTask = (vlad, type) => {
        const newData = {...vlad, status: type}
        updateDocument("workers", vlad?.docId, {status: type});
        setWidgetData(newData) 
    }

    const findMatchingRequest = (vlad) => {
        const match = requests?.filter((elem) => elem?.order_id == vlad);

        return match[0];
    }

    return (
        <div className='dashmainCntn special workers'>
            <h1>Workers</h1>
            <div className="listheaderBar">
                <p>#</p>
                <p>Name</p>
                <p>Email</p>
                <p>Number</p>
                <p>Status</p>
                <p>Interactions</p>
                <p>More</p>
            </div>

            <div className="theList">
                {
                    allWorkers?.length ? (
                        filteredList?.map((elem, idx) => (
                            <div className="unitList" key={`unitClientsList_${idx}`}>
                                <p>{idx+1}</p>
                                <p>{elem?.first_name} {elem?.last_name}</p>
                                <p>{elem?.email_addresses[0].email_address}</p>
                                <p className='planType'>{findMatchingRequest(elem?.interactions[0])?.plan}</p>
                                <p className={`planType capital ${elem?.status ? elem?.status : 'active'}`}>{elem?.status ? elem?.status : 'active'}</p>
                                <p>
                                    {
                                        elem?.interactions?.filter((unit, idx) => idx <= 4).map((elem, idx) => (
                                            <img src={`/${findMatchingRequest(elem)?.platform}.png`} alt={`${findMatchingRequest(elem)?.platform}`} />
                                        ))
                                    }
                                </p>
                                <p onClick={() => {handleSetWidgetValue(elem)}}><i className="icofont-info-circle"></i></p>
                            </div>
    
                        ))
                    ) : (
                        <h2>This dataset is empty</h2>
                    )
                }
            </div>

            <div className="paginationCntn">
                <p>{currNum - (incCount - 1)} - {currNum > totalNum ? totalNum : currNum} of {totalNum} </p>

                {
                    totalNum > incCount && (
                        <div className="navigationBtnCntn">
                            <button onClick={handleShownPrev} type="button"><i className="icofont-simple-left"></i></button>
                            {
                                [...Array(totalsects).keys()]?.map((elem, idx) => {
                                    if (currentshowingBtn >= idx+1 && currentshowingBtn-4 <= idx+1) {
                                        return (
                                            <button key={`btnUtil_${idx}`} onClick={() => {handleShowCurrentSect(idx)}} className={activeSect === idx+1 && "active"} type="button">{idx+1}</button>
                                        )
                                    } else {
                                        return (
                                            <></>
                                        )
                                    }

                                })
                            }
                            {
                                currentshowingBtn + 1 < totalsects && (
                                    <button type="button">...</button>
                                )
                            }
                            {
                                currentshowingBtn < totalsects  && (
                                    <button onClick={() => {setcurrNum(50 * totalNum); setactiveSect(totalNum)}} className={activeSect === totalsects && "active"} type="button">{totalsects}</button>
                                )
                            }
                            <button onClick={handleShownNext} type="button"><i className="icofont-simple-right"></i></button>
                        </div>

                    )
                }
            </div>

            {
                showWidget && (
                    <div className="theCartCntn">
                        <div className="theCart">
                            <div className="cartHead">
                                <h2>Client Request Details</h2>
                                <button type="button" onClick={() => {setshowWidget(false)}}><i className="icofont-close-line"></i></button>
                            </div>
                            <div className="cartBody">
                                <div className="unitWidgetCntn">
                                    <div className="upndownCntn">
                                        <p>Name</p>
                                        <h3>{widgetData?.userData?.fullname}</h3>
                                    </div>
                                    <div className="upndownCntn">
                                        <p>User ID</p>
                                        <h3>{widgetData?.u_id}</h3>
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className="upndownCntn">
                                        <p>eMail</p>
                                        <h3>{widgetData?.userData?.email}</h3>
                                    </div>
                                    <div className="upndownCntn">
                                        <p>Phone Number</p>
                                        <h3>{widgetData?.userData?.phone ? widgetData?.userData?.phone : "Undefined"}</h3>
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className={`unitPlanType`}>
                                        <div className="right">
                                            <p>Selected Plan  <img className="shippingImg" src="/shipping.png" alt="/" /></p>
                                            <h3>{widgetData?.plan} Plan</h3>
                                            <p>Best for small business</p>

                                            <h2>$<b>{widgetData?.amount}</b>/Platform</h2>
                                        </div>
                                        
                                    </div>
                                    <div className={`unitPlanType`}>
                                        <div className="right">
                                            <p>Selected platforms</p>

                                            <div className="platformList">
                                                <img src={`/${widgetData?.platform}.png`} alt={`${widgetData?.platform}`} />
                                            </div>
                                        </div>
                                        {/* <img src="/yelp.png" alt="/" /> */}
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className="requestState">
                                        <p>Operation Status:</p>

                                        <span className={`${widgetData?.status ? widgetData?.status : 'active'}`}>{widgetData?.status ? widgetData?.status : 'active'}</span>
                                    </div>
                                </div>
                                <div className="approve_decline">
                                    <button onClick={() => {validateTask(widgetData, "active")}} type="button">Activate</button>
                                    <button onClick={() => {validateTask(widgetData, "deactivated")}} type="button">Deactivated</button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default page