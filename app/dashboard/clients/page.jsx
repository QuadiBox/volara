'use client'
import { fetchAllDocuments, onSnapshotWithoutCondition } from "@/app/db/firestoreService";
import Link from "next/link";
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
    const [allClients, setAllClients] = useState([]);
    // const [showCount, setshowCount] = useState(3);

    // const { isLoaded, isSignedIn, user } = useUser();

    const filteredList = allClients.filter((elem, idx) => idx <= currNum);


    useEffect(() => {

        const fetchRequests = onSnapshotWithoutCondition(
            'requests',
            (documents) => {
                setRequests(documents)
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
                setTotalNum(documents?.length);
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

    return (
        <div className='dashmainCntn special clients'>
            <h1>Clients</h1>
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
                    allClients?.length ? (
                        filteredList?.map((elem, idx) => (
                            <div className="unitList" key={`unitClientsList_${idx}`}>
                                <p>{idx+1}</p>
                                <p>{elem?.first_name} {elem?.last_name}</p>
                                <p>{elem?.email_addresses[0].email_address}</p>
                                <p className='planType'>{requests.filter((element) => element?.u_id === elem?.id)[0]?.plan}</p>
                                <p className={`planType capital ${requests.filter((element) => element?.u_id === elem?.id)[0]?.status}`}>{requests.filter((element) => element?.u_id === elem?.id)[0]?.status}</p>
                                <p>
                                    {
                                        requests.filter((element) => element?.u_id === elem?.id).filter((unit, idx) => idx <= 4).map((elem, idx) => (
                                            <img src={`/${elem?.platform}.png`} alt={`${elem?.platform}`} />
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
                <p>{currNum - (incCount - 1)} - {currNum} of {totalNum} </p>

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
                                <h2>Client Details</h2>
                                <button type="button" onClick={() => {setshowWidget(false)}}><i className="icofont-close-line"></i></button>
                            </div>
                            <div className="cartBody">
                                <div className="unitWidgetCntn">
                                    <div className="upndownCntn">
                                        <p>Name</p>
                                        <h3>{widgetData?.first_name} {widgetData?.last_name}</h3>
                                    </div>
                                    <div className="upndownCntn">
                                        <p>User ID</p>
                                        <h3>{widgetData?.id}</h3>
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className="upndownCntn">
                                        <p>eMail</p>
                                        <h3>{widgetData?.email_addresses[0].email_address}</h3>
                                    </div>
                                    <div className="upndownCntn">
                                        <p>Phone Number</p>
                                        <h3>{widgetData?.phone}</h3>
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className={`unitPlanType`}>
                                        <div className="right">
                                            <p>Selected Plan  <img className="shippingImg" src="/shipping.png" alt="/" /></p>
                                            <h3>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.plan} Plan</h3>
                                            <p>Best for small business</p>

                                            <h2>$<b>{requests?.filter((element) => element?.u_id === widgetData?.id)[0]?.amount}</b>/Platform</h2>
                                        </div>
                                        
                                    </div>
                                    <div className={`unitPlanType`}>
                                        <div className="right">
                                            <p>Selected platforms</p>

                                            <div className="platformList">
                                                {
                                                    requests.filter((element) => element?.u_id === widgetData?.id).filter((unit, idx) => idx <= 4).map((elem, idx) => (
                                                        <img src={`/${elem?.platform}.png`} alt={`${elem?.platform}`} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        {/* <img src="/yelp.png" alt="/" /> */}
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className="requestState">
                                        <p>Request Status:</p>

                                        <span className={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.status}`}>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.status}</span>
                                    </div>
                                </div>
                                <div className="unitWidgetCntn">
                                    <div className="upndownCntn">
                                        <p>Engagement links</p>

                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.likes !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.likes}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.likes.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.likes : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.likes}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.reposts !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.reposts}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.reposts.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.reposts : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.reposts}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.comments !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.comments}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.comments.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.comments : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.comments}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.views !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.views}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.views.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.views : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.views}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.saves !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.saves}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.saves.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.saves : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.saves}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.follows !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.follows}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.follows.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.follows : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.follows}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                        {
                                            requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.subscribers !== '' && (
                                                <div className="requestState">
                                                    <p>{requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.subscribers}</p>

                                                    <a href={`${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.subscribers.startsWith('https://') ? requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.subscribers : `https://${requests.filter((element) => element?.u_id === widgetData?.id)[0]?.links?.subscribers}` }`} target="_blank"> <i className="icofont-link"></i> Open</a>
                                                </div>
                                            )
                                        }
                                    </div>
                                    
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
