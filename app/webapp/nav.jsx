import Link from 'next/link';

const Nav = ({ type }) => {
    return (
        <nav className='navVolara'>
            <Link href={"/webapp"} className='unitVolaraNavLink'>
                {
                    type === 'home' ? (
                        <img src="/home_active.png" alt="home icon" />
                    ) : (
                        <img src="/home.png" alt="home icon" />
                    )
                }
                <p style={{color: `${type === 'home' ? "white" : "#5A5A5A"}`}}>Home</p>
            </Link>
            <Link href={"/webapp/tasks"} className='unitVolaraNavLink'>
                {
                    type === 'tasks' ? (
                        <img src="/tasks_active.png" alt="tasks icon" />
                    ) : (
                        <img src="/tasks.png" alt="tasks icon" />
                    )
                }
                <p style={{color: `${type === 'tasks' ? "white" : "#5A5A5A"}`}}>Tasks</p>
            </Link>
            <Link href={"/webapp/airdrop"} className='unitVolaraNavLink'>
                {
                    type === 'airdrop' ? (
                        <img src="/airdrop_active.png" alt="airdrop icon" />
                    ) : (
                        <img src="/airdrop.png" alt="airdrop icon" />
                    )
                }
                <p style={{color: `${type === 'airdrop' ? "white" : "#5A5A5A"}`}}>Airdrop</p>
            </Link>
            <Link href={"/webapp/invite"} className='unitVolaraNavLink'>
                {
                    type === 'invite' ? (
                        <img src="/invite_active.png" alt="invite icon" />
                    ) : (
                        <img src="/invite.png" alt="invite icon" />
                    )
                }
                <p style={{color: `${type === 'invite' ? "white" : "#5A5A5A"}`}}>Invite</p>
            </Link>
            <Link href={"/webapp/profile"} className='unitVolaraNavLink'>
                {
                    type === 'profile' ? (
                        <img src="/profile_active.png" alt="profile icon" />
                    ) : (
                        <img src="/profile.png" alt="profile icon" />
                    )
                }
                <p style={{color: `${type === 'profile' ? "white" : "#5A5A5A"}`}}>Profile</p>
            </Link>
        </nav>
    )
}

export default Nav
