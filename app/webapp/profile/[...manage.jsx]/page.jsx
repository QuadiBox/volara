import React from 'react'
import Header from '../../Header'
import Nav from '../../nav'
import { UserProfile } from '@clerk/nextjs'
import { dark } from "@clerk/themes";

const Page = () => {
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <section className="curentCntn">
                    <UserProfile
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorBackground: "#252220",
                                fontSize: "14px",
                                colorText: "#ffffff",
                                colorNeutral: "#656565",
                                colorInputBackground: "transparent"
                            }
                        }}
                        path='/webapp/profile/manage'
                    ></UserProfile>
                </section>

                <Nav type={'profile'}></Nav>
            </div>
        </div>
    )
}

export default Page
