'use client'
import { onSnapshotWithoutCondition, updateDocument } from "@/app/db/firestoreService";
import Link from "next/link";
import { useState, useEffect } from "react"
// import { useUser } from "@clerk/nextjs";

const Page = () => {
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
    const [allClients, setAllClients] = useState([]);
    // const [showCount, setshowCount] = useState(3);

    // const { isLoaded, isSignedIn, user } = useUser();
    const filteredList = requests.filter((elem, idx) => idx <= currNum && elem?.locationData?.country !== undefined && elem?.locationData?.country !== null);


    useEffect(() => {

        const fetchRequests = onSnapshotWithoutCondition(
            'requests',
            (documents) => {
                const firstFilter = documents?.filter((elem) => elem?.locationData?.country !== undefined && elem?.locationData?.country !== null)
                setRequests(firstFilter)
                setTotalNum(firstFilter?.length);
            }
        )
      
        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, []);

    useEffect(() => {

        const fetchClients = onSnapshotWithoutCondition(
            'clients',
            (documents) => {
                setAllClients(documents)
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
        updateDocument("requests", vlad?.docId, {status: type});
        setWidgetData(newData)
        
    }

    return (
        <div className='dashmainCntn special tasks'>
            <h1>All Tasks</h1>
            <div className="listheaderBar">
                <p>#</p>
                <p>Name</p>
                <p>Email</p>
                <p>Plan</p>
                <p>Request Status</p>
                <p>Platforms</p>
                <p>More</p>
            </div>

            <div className="theList">
                {
                    requests?.length ? (
                        filteredList?.map((elem, idx) => (
                            <div className="unitList" key={`unitClientsList_${idx}`}>
                                <p>{idx+1}</p>
                                <p>{elem?.userData?.fullname}</p>
                                <p>{elem?.userData?.email}</p>
                                <p className='planType'>{elem?.plan}</p>
                                <p className={`planType capital ${elem?.status}`}>{elem?.status}</p>
                                <p>
                                    <img src={`/${elem?.platform}.png`} alt={`${elem?.platform}`} />
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
                                        <p>Request Status:</p>

                                        <span className={`${widgetData?.status}`}>{widgetData?.status}</span>
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className="upndownCntn">
                                        <p>Engagement links</p>

                                        {
                                            widgetData?.links?.likes !== '' && (
                                                <div className="requestState">
                                                    <p>{widgetData?.links?.likes}</p>

                                                    <a href={`${widgetData?.links?.likes.startsWith('https://') ? widgetData?.links?.likes : `https://${widgetData?.links?.likes}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            widgetData?.links?.reposts !== '' && (
                                                <div className="requestState">
                                                    <p>{widgetData?.links?.reposts}</p>

                                                    <a href={`${widgetData?.links?.reposts.startsWith('https://') ? widgetData?.links?.reposts : `https://${widgetData?.links?.reposts}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            widgetData?.links?.comments !== '' && (
                                                <div className="requestState">
                                                    <p>{widgetData?.links?.comments}</p>

                                                    <a href={`${widgetData?.links?.comments.startsWith('https://') ? widgetData?.links?.comments : `https://${widgetData?.links?.comments}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            widgetData?.links?.shares !== '' && (
                                                <div className="requestState">
                                                    <p>{widgetData?.links?.shares}</p>

                                                    <a href={`${widgetData?.links?.shares.startsWith('https://') ? widgetData?.links?.shares : `https://${widgetData?.links?.shares}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            widgetData?.links?.follows !== '' && (
                                                <div className="requestState">
                                                    <p>{widgetData?.links?.follows}</p>

                                                    <a href={`${widgetData?.links?.follows.startsWith('https://') ? widgetData?.links?.follows : `https://${widgetData?.links?.follows}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                    </div>
                                    
                                </div>
                                {
                                    widgetData?.status === 'pending' && (
                                        <div className="approve_decline">
                                            <button onClick={() => {validateTask(widgetData, "active")}} type="button">Approve</button>
                                            <button onClick={() => {validateTask(widgetData, "declined")}} type="button">Decline</button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Page