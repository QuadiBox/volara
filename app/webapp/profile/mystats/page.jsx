import React from 'react'
import Nav from '../../nav'
import Header from '../../Header'
import { currentUser } from '@clerk/nextjs/server';
import StatMainDetails from './StatMainDetails';


const Page = async () => {
    const user = await currentUser();
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <StatMainDetails></StatMainDetails>

                <Nav type={'profile'}></Nav>
            </div>
        </div>
    )
}

export default Page
