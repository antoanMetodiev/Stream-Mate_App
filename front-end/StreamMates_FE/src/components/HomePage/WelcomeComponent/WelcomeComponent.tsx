import style from "./WelcomeComponent.module.css";

import appleStoreImg from "../../../images/apple-store.png";
import googleStoreImg from "../../../images/google-play.webp";

import { TitleLogoComponent } from "./TitleLogoComponent/TitleLogoComponent";
import { Navigation } from "./Navigation/Navigation";
import { User } from "../../../types/User";
import { Link } from "react-router-dom";

import backgroundImg from "./../../../images/images.webp";

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
            <Navigation
                user={user}
                setUser={setUser}
                setAllMoviesCount={() => { }}
                setCurrentPaginationPage={() => { }}
                setGenres={() => { }}
                setCinemaRecordsList={() => { }}
                setSearchedMovieTitle={() => { }}
                setInputValue={() => { }}
            />
            <TitleLogoComponent />


            <section className={style['site-info-container']}>
                <h2>Enjoy Thoughtful Entertainment</h2>
                <h5>Stream thousands of films, series and tv channels for free, thanks to the generous support of your public library or university.</h5>
                {!user && (
                    <h4>
                        Have a Stream Mate account?{' '}
                        <Link to="/login" className={style['login-link']}>
                            Log In
                        </Link>
                    </h4>
                )}
                <div className={style['phone-store-images']}>
                    <img src={appleStoreImg} alt="appleStoreImg" />
                    <img src={googleStoreImg} alt="googleStoreImg" />
                </div>
            </section>


            <div className={style['background-img-wrapper']}>
                <span className={style['background-img-shadow']}></span>
                <img
                    className={style["background-img"]}
                    src={backgroundImg}
                    alt="backgroundImg"
                />
            </div>
        </div>
    );
}