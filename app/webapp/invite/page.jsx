import Nav from '../nav'
import Header from '../Header'

const Page = () => {
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <section className="curentCntn">
                    <div className="inviteTopDisplay">
                        <h3>Let&apos;s grow the</h3>
                        <h1>Volara Community Together</h1>
                        <p>Volara is an ecosystem community that is mined by 2 major factors; Work done and Community influence</p>
                    </div>
                    <div className="inviteMessge">
                        <img src="/gift.png" alt="gift" />
                        <h2>Refer a friend and earn <img src="/coin.png" alt="coin" /> 1.0 <span>Volara coin</span> for yourself</h2>
                    </div>
                    <div className="inviteCopyLinkCntn">
                        <button type="button">Invite a friend</button>
                        <button type="button"><i className="icofont-ui-copy"></i></button>
                    </div>
                </section>

                <Nav type={'tasks'}></Nav>
            </div>
        </div>
    )
}

export default Page
