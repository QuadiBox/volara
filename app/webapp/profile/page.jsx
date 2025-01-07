import React from 'react'
import Nav from '../nav'
import Header from '../Header'
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

const Page = async () => {
    const user = await currentUser();
    
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <section className="curentCntn">
                    <div className="profileDetailsDisplay">
                        <img src={user?.imageUrl} alt="profile image" />
                        <h1>{user?.fullName ? user?.fullName : 'John Doe'}</h1>
                        <p>{user?.emailAddresses[user?.emailAddresses.length - 1].emailAddress}</p>
                        <Link href={"/webapp/profile/manage"}>Edit profile <i className="icofont-pencil-alt-2"></i></Link>
                    </div>
                    <div className="profileRelatedLinks">
                        <Link href={"/webapp/profile/manage"} className="unitProfileLink">
                            <img src="/user_edit.svg" alt="user settings icon" />
                            <h3>Edit profile</h3>
                            <i className="icofont-rounded-right"></i>
                        </Link>
                        <Link href={"/webapp/profile/mystats"} className="unitProfileLink">
                            <img src="/stats.svg" alt="dashboard" />
                            <h3>My stats</h3>
                            <i className="icofont-rounded-right"></i>
                        </Link>
                        <Link href={"/webapp/profile/transactions"} className="unitProfileLink">
                            <img src="/transactions.svg" alt="money bag" />
                            <h3>Transactions</h3>
                            <i className="icofont-rounded-right"></i>
                        </Link>
                        <Link href={"/webapp/profile/help"} className="unitProfileLink">
                            <img src="/help.svg" alt="questions mark" />
                            <h3>Help</h3>
                            <i className="icofont-rounded-right"></i>
                        </Link>
                    </div>
                    {/* <div className="logOutCntn">
                        <SignOutButton></SignOutButton>
                    </div> */}
                </section>

                <Nav type={'profile'}></Nav>
            </div>
        </div>
    )
}

export default Page