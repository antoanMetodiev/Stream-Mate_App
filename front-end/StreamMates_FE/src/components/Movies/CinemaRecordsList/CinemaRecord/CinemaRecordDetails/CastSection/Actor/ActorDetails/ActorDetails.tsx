import style from "./ActorDetails.module.css";
import { Header } from "../../../../../../Header/Header";
import { useLocation } from "react-router-dom";
import { constants } from "../../../../../../../../constants/constants";
import { ActorType } from "../../../../../../../../types/ActorType";
import { calculateAge } from "../../../../../../../../utils/utils";

import { BigImage } from "../../../../../../../BigImage/BigImage";
import { useEffect, useRef, useState } from "react";
import { Footer } from "../../../../../../../Footer/Footer";

export const ActorDetails = () => {
    const location = useLocation();
    const backgroundImg_URL = location.state?.backgroundImg_URL;
    const actor = location.state?.actor as ActorType;

    const [showBigImage, setShowBigImage] = useState(false);
    const imageURLForBigImageRef = useRef("");
    const imageTypeForBigImageRef = useRef("");

    // Functions:
    const showBigImageHandler = () => {
        if (actor.imageURL === undefined) return;
        imageURLForBigImageRef.current = constants.TMDB_IMG_URL + actor?.imageURL;
        imageTypeForBigImageRef.current = "actor";
        setShowBigImage(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={style['details-container-wrapper']}>
            <Header
                genres=""
                inputValue=""
                user={null}
                searchedMovieTitle=""
                setGenres={() => {}}
                setAllMoviesCount={() => {}}
                setCurrentPaginationPage={() => {}}
                setInputValue={() => {}}
                setSearchedMovieTitle={() => {}}
                setIsLoading={() => {}}
                setLastPathName={() => {}}
                setCinemaRecordsList={() => { }}
            />
            {showBigImage && (
                <>
                    <BigImage
                        imageURL={imageURLForBigImageRef.current}
                        imageType={imageTypeForBigImageRef.current}
                        setShowBigImage={setShowBigImage}
                    />
                </>
            )}


            <section className={style['details-container']}>
                {actor.imageURL && (
                    <img
                        onClick={showBigImageHandler}
                        className={style['actor-image']}
                        src={constants.TMDB_IMG_URL + actor.imageURL}
                        alt={actor.nameInRealLife || "Actor image"}
                    />
                )}
                {actor.nameInRealLife && <h3 className={style['actor-real-name']}>{actor.nameInRealLife}</h3>}
                {actor.biography && <h4 className={style['biography']}>{"- " + actor.biography}</h4>}

                <div className={style['external-links']}>
                    {actor.instagramUsername && (
                        <a href={"https://www.instagram.com/" + actor.instagramUsername} target="_blank">
                            <img className={style['social-link-image']} src={constants.SOCIAL_MEDIA_LOGOS.instagramUsername} alt="Instagram" />
                        </a>
                    )}
                    {actor.twitterUsername && (
                        <a href={"https://x.com/" + actor.twitterUsername} target="_blank">
                            <img className={style['social-link-image']} src={constants.SOCIAL_MEDIA_LOGOS.twitterUsername} alt="Twitter" />
                        </a>
                    )}
                    {actor.imdbId && (
                        <a href={"https://www.imdb.com/name/" + actor.imdbId + "/?ref_=tt_cst_i_1"} target="_blank">
                            <img className={style['social-link-image']} src={constants.SOCIAL_MEDIA_LOGOS.imdbId} alt="IMDb" />
                        </a>
                    )}
                    {actor.facebookUsername && (
                        <a href={"https://www.facebook.com/" + actor.facebookUsername} target="_blank">
                            <img className={style['social-link-image']} src={constants.SOCIAL_MEDIA_LOGOS.facebookUsername} alt="Facebook" />
                        </a>
                    )}
                </div>

                <div className={style['meta-info-information-container']}>
                    {actor.birthday && (
                        <h3>
                            Birthday: <span className={style['diff-color']}>{actor.birthday} (Age: {calculateAge(actor.birthday)})</span>
                        </h3>
                    )}
                    {actor.placeOfBirth && (
                        <h3>
                            Place of Birth: <span className={style['diff-color']}>{actor.placeOfBirth}</span>
                        </h3>
                    )}
                    {actor.gender !== undefined && actor.gender !== null && (Number(actor.gender) === 1 || Number(actor.gender) === 2) && (
                        <h3>
                            Gender: <span className={style['diff-color']}>{Number(actor.gender) === 1 ? "Female" : "Male"}</span>
                        </h3>
                    )}
                    {actor.knownFor && (
                        <h3>
                            Known For: <span className={style['diff-color']}>{actor.knownFor}</span>
                        </h3>
                    )}
                    {actor.popularity && (
                        <h3>
                            Popularity: <span className={style['diff-color']}>{actor.popularity}</span>
                        </h3>
                    )}
                </div>
            </section>


            <span className={style['background-img-shadow']}></span>
            <img
                className={style['background-img']}
                src={constants.TMDB_IMG_URL + backgroundImg_URL}
                alt={actor.nameInRealLife}
            />

            <Footer />
        </div>
    );
};