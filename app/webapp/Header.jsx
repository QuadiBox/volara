import BackButton from './BackButton';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server'

const Header = async () => {
    const user = await currentUser();

    return (
        <header className='headerVolara'>
            <BackButton></BackButton>

            <Link href={"/webapp"}>
                <img src="/darklogo.png" alt="Volara dark theme logo" />
            </Link>

            <Link href={"/webapp/profile"}>
                <img src={user?.imageUrl} alt="profile photo" />
            </Link>
        </header>
    )
}

export default Header
