import React from 'react'
import Nav from '../nav'
import Header from '../Header'
import MainDisplay from './MainDisplay'

const Page = () => {
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <MainDisplay></MainDisplay>

                <Nav type={'airdrop'}></Nav>
            </div>
        </div>
    )
}

export default Page
