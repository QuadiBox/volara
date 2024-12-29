import Link from 'next/link'
import React from 'react'
import Nav from './nav'
import BackButton from './BackButton'
import Todos from './Todos'

const page = () => {
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <header className='headerVolara'>
                    <BackButton></BackButton>

                    <Link href={"/webapp"}>
                        <img src="/darklogo.png" alt="Volara dark theme logo" />
                    </Link>

                    <Link href={"/webapp/"}>
                        <img src="/telegram.png" alt="profile photo" />
                    </Link>
                </header>

                <section className="curentCntn">
                    <div className="fancyDisplay">
                        <h1>The <br /> Future <br /> is Here</h1>
                        <img src="/coin_large.png" alt="coin" />
                    </div>
                    <div className="homeAmountDisplay">
                        <h2><img src="/coin.png" alt="coin" /> 36.064 <span>Volara coin</span></h2>
                        <p>Your all time earnings</p>
                        <Link className='fancyCta' href={'/webapp/profile'}>View more</Link>

                        <img src="/coin_large.png" alt="coin" />
                    </div>

                    <Todos></Todos>
                </section>

                <Nav type={'home'}></Nav>
            </div>
        </div>
    )
}

export default page
