import React from 'react'
import Nav from '../nav'
import Todos from '../Todos'
import Header from '../Header'

const Page = () => {
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <section className="curentCntn">
                    <Todos isTask={true}></Todos>
                </section>

                <Nav type={'tasks'}></Nav>
            </div>
        </div>
    )
}

export default Page
