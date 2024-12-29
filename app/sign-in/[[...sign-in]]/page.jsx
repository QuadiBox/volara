import { SignIn } from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import BackLink from '@/app/backlink';

const Page = () => {
    return (
        <div className='signInCntn'>
            <div className="theNav">
                <BackLink></BackLink>
            </div>
            <SignIn
                appearance={{
                    baseTheme: dark,
                    variables: {
                        colorBackground: "#252220",
                        fontSize: "14px",
                        colorText: "#ffffff",
                        colorNeutral: "#94949426",
                        colorInputBackground: "#252220"
                    }
                }}
            ></SignIn>
        </div>
    )
}

export default Page
