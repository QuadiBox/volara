import Link from "next/link"
import FAQ from "./FAQ"

const page = () => {
  return (
    <div className="grandCntn">
      <nav className="homepage_nav">
          <Link href={"/"}>
            <img src="/Logo.png" alt="logo" />
          </Link>
          <Link className="fancyBtn" href={"/"}>Start Earning</Link>
      </nav>

      <div className="sectionsCntn">
        <section className="firstSect">
          <div className="left">
            <img src="/users_show.png" alt="users" />
            <h1>Continue Earning <br /> While You <span>Tap</span></h1>
            <Link className="fancyBtn" href={"/"}>Learn more</Link>

            <span aria-hidden className="separator"></span>
            <div className="lastdiv">
              <div className="unitDetailsCntn">
                <img src="/wallet.png" alt="wallet" />
                <div className="details">
                  <h2>No Subscription fee</h2>
                  <p>Earn easily withput worrying about paying subcription fees</p>
                </div>
              </div>
              <div className="unitDetailsCntn">
                <img src="/telegram.png" alt="wallet" />
                <div className="details">
                  <h2>Operates from telegram</h2>
                  <p>All you need is your readily active telegram account. Just connect to the telegram bot and start earning.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <img src="/guy.png" alt="smiling guy" />
            <img src="/shadow.png" alt="smiling guy 's shadow" />
          </div>
        </section>

        <section className="secondSect">
          <h2>Start Earning in 3 Easy Steps</h2>
          <div className="unitStep">
            <p>01</p>
            <div className="detail">
              <h3>Register you details on Volara</h3>
              <p>Sign up and create your profile to start your journey towarsd earning rewards effortlessly</p>
            </div>
          </div>
          <div className="unitStep">
            <div className="detail left">
              <h3>Connect To Your to your Telegram Account</h3>
              <p>Sync your telegram handle to seamlessly engage and unlock new earning opportunities. </p>
            </div>
            <p>02</p>
          </div>
          <div className="unitStep">
            <p>03</p>
            <div className="detail">
              <h3>Start Tapping To Earn </h3>
              <p>Sync your telegram handle to seamlessly engage and unlock new earning opportunities. </p>
            </div>
          </div>
        </section>

        <FAQ></FAQ>

        <footer className="theFooter">
          <div className="topfooter">
            <Link href={'/'}><img src="/Logo.png" alt="volara logo" /></Link>
            <div className="fancyBorderCntn">
              <div className="innerBox">
                <input type="text" placeholder="Email"/>
                <button className="fancyBtn" type="button">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="bottomFooter">
            <p>&copy; 2024 All right reserved. Volara</p>
          </div>
        </footer>

      </div>

    </div>
  )
}

export default page
