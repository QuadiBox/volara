'use client'

import { useState, useRef } from 'react';
import Link from 'next/link';

const FAQ = () => {
    const containerRef = useRef(null);
    const [activeFAQ, setActiveFAQ] = useState(-1);

    const handleFAQToggle = (vlad) => {
        if (activeFAQ === vlad) {
            setActiveFAQ(-1);
        } else {
            setActiveFAQ(vlad);
        }
    };

    return (
        <section className='FAQ'>
            <h2>FAQ</h2>
            <div ref={containerRef} className="faqCntn">
                <div className="unitQuestion" >
                    <div className="fancyBorderCntn">
                        <div className="questionHeading" onClick={() => {handleFAQToggle(0)}}>
                            <h3>Question 1: What is Volara?</h3>
                            <i className="icofont-thin-down" style={{rotate: `${activeFAQ === 0? "180deg": "0deg"}`}}></i>
                        </div>
                    </div>
                    {
                        activeFAQ === 0 && (
                            <div className="answerBody">
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet fuga nisi, et id magni dolores saepe tempore quae alias odio.</p>
                                <p>We&apos;re excited to have you!</p>
                            </div>
                        )
                    }
                </div>
                <div className="unitQuestion" >
                    <div className="fancyBorderCntn">
                        <div className="questionHeading" onClick={() => {handleFAQToggle(0)}}>
                            <h3>Question 1: What is Volara?</h3>
                            <i className="icofont-thin-down" style={{rotate: `${activeFAQ === 0? "180deg": "0deg"}`}}></i>
                        </div>
                    </div>
                    {
                        activeFAQ === 0 && (
                            <div className="answerBody">
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet fuga nisi, et id magni dolores saepe tempore quae alias odio.</p>
                                <p>We&apos;re excited to have you!</p>
                            </div>
                        )
                    }
                </div>
                <div className="unitQuestion" >
                    <div className="fancyBorderCntn">
                        <div className="questionHeading" onClick={() => {handleFAQToggle(1)}}>
                            <h3>Question 1: How to get started?</h3>
                            <i className="icofont-thin-down" style={{rotate: `${activeFAQ === 1? "180deg": "0deg"}`}}></i>
                        </div>
                    </div>
                    {
                        activeFAQ === 1 && (
                            <div className="answerBody">
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet fuga nisi, et id magni dolores saepe tempore quae alias odio.</p>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        )
                    }
                </div>
                <div className="unitQuestion" >
                    <div className="fancyBorderCntn">
                        <div className="questionHeading" onClick={() => {handleFAQToggle(2)}}>
                            <h3>Question 1: How to start earning?</h3>
                            <i className="icofont-thin-down" style={{rotate: `${activeFAQ === 2? "180deg": "0deg"}`}}></i>
                        </div>
                    </div>
                    {
                        activeFAQ === 2 && (
                            <div className="answerBody">
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet fuga nisi, et id magni dolores saepe tempore quae alias odio.</p>
                                <p>We&apos;re excited to have you!</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default FAQ
