import Link from 'next/link'
import React from 'react'
import Nav from './nav'
import BackButton from './BackButton'
import Todos from './Todos'
import HomeAmountDisplay from './HomeAmountDisplay'
import Header from './Header'

const Page = () => {

    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <section className="curentCntn">
                    <div className="fancyDisplay">
                        <h1>The <br /> Future <br /> is Here</h1>
                        <img src="/coin_large.png" alt="coin" />
                    </div>
                    <div className="homeAmountDisplay">
                        <HomeAmountDisplay></HomeAmountDisplay>
                        <p>Your all time earnings</p>
                        <Link className='fancyCta' href={'/webapp/profile'}>View more</Link>

                        <img src="/coin_large.png" alt="coin" />
                    </div>

                    <Todos isTask={false}></Todos>
                </section>

                <Nav type={'home'}></Nav>
            </div>
        </div>
    )
}

export default Page
