import style from "./WelcomeComponent.module.css";

import appleStoreImg from "../../../images/apple-store.png";
import googleStoreImg from "../../../images/google-play.webp";
import backgroundImage from "../../../images/landing.jpg";

import { TitleLogoComponent } from "./TitleLogoComponent/TitleLogoComponent";
import { Navigation } from "./Navigation/Navigation";
import { User } from "../../../types/User";

interface WelocmeComponentProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const WelcomeComponent = ({
    user,
    setUser,
}: WelocmeComponentProps) => {


    return (
        <div className={style['welcome-component-container']}>

            <Navigation user={user} setUser={setUser} />
            <TitleLogoComponent />


            <section className={style['site-info-container']}>
                <h2>Enjoy Thoughtful Entertainment</h2>
                <h5>Stream thousands of films,series and tv channels for free, thanks to the generous support of your public library or university.</h5>
                <button>JOIN INTO COMUNITY</button>
                <h4>Have a Kanopy account? <span>Log in</span></h4>
                <div className={style['phone-store-images']}>
                    <img src={appleStoreImg} alt="appleStoreImg" />
                    <img src={googleStoreImg} alt="googleStoreImg" />
                </div>
                <div className="also-avalaible-on-container">
                    <h5>Also available on:</h5>
                    <img src="" alt="" />
                    <img src="" alt="" />
                    <img src="" alt="" />
                    <img src="" alt="" />
                    <img src="" alt="" />
                    <img src="" alt="" />
                </div>
            </section>


            <div className={style['background-video-wrapper']}>
                <span className={style['background-video-shadow']}></span>

                {/* <img
                    src={backgroundImage}
                    alt="backgroundImage"
                    className={style['background-video']}
                /> */}

                <video
                    className={style['background-video']}
                    src="https://yourprimetv.co/wp-content/uploads/2025/01/yourprime.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                ></video>
            </div>
        </div>
    );
}