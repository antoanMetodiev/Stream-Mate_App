import { useEffect, useRef, useState } from "react";
import style from "./CinemaRecordDetails.module.css";
import { useLocation } from "react-router-dom";
import { Series } from "../../../../../types/Series";
import { Movie } from "../../../../../types/MovieType";
import { constants } from "../../../../../constants/constants";
import { Header } from "../../../Header/Header";
import { Details } from "./Details/Details";
import { CastSection } from "./CastSection/CastSection";
import { PlayerSection } from "./PlayerSection/PlayerSection";
import { ImageSection } from "./ImageSection/ImageSection";
import { EpisodesSection } from "./EpisodesSection/EpisodesSection";
import axios from "axios";
import { Footer } from "../../../../Footer/Footer";
import { Loader } from "../../../../Loader/Loader";
import { CommentsSection } from "./CommentsSection/CommentsSection";
import { User } from "../../../../../types/User";

export const CinemaRecordDetails = () => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";

    const location = useLocation();
    const [myData] = useState<User | undefined>(location.state?.user ? location.state?.user : undefined);
    const [currentCinemaRecordId] = useState(location.state?.cinemaRecordId ? location.state?.cinemaRecordId : "");

    const [cinemaRecord, setCinemaRecord] = useState<(Movie | Series) | null>(null);
    const [showPlayerSection, setShowPlayerSection] = useState<boolean>(!location.pathname.includes("/series/"));
    const [currentEpisodeURL, setCurrentEpisodeURL] = useState("");
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status

    // Refs:
    const playerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        debugger;
        if (cinemaRecord) return;

        const data = location.pathname.split("/");
        const cinemaRecordId = data[data.length - 1];
        const additionalUrl = location.pathname.includes("movie") ? "/get-movie-details" : "/get-series-details";

        const getCinemaRecordDetails = async () => {
            if (cinemaRecordId.length == 0) return;
            try {
                const apiResponse = await axios.get(`${BASE_URL}${additionalUrl}`, {
                    params: { id: cinemaRecordId },
                    withCredentials: true
                });

                console.log(apiResponse.data);

                setCinemaRecord(apiResponse.data);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.log(error);
                setLoading(false); // Ensure loading state is removed in case of error
            };
        };

        getCinemaRecordDetails();
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                cinemaRecord && (
                    <article className={style['cinema-record-details-container']}>
                        <Header
                            user={null}
                            setCinemaRecordsList={() => { }}
                            genres={""}
                            inputValue={""}
                            searchedMovieTitle={""}
                            setGenres={() => { }}
                            setAllMoviesCount={() => { }}
                            setInputValue={() => { }}
                            setIsLoading={() => { }}
                            setSearchedMovieTitle={() => { }}
                            setLastPathName={() => { }}
                            setCurrentPaginationPage={() => { }}
                        />
                        <Details cinemaRecord={cinemaRecord} />
                        <CastSection cinemaRecord={cinemaRecord} />
                        {cinemaRecord?.imagesList && <ImageSection imagesList={cinemaRecord?.imagesList} />}

                        {showPlayerSection && (
                            <div ref={playerRef}>
                                <PlayerSection
                                    videoURL={currentEpisodeURL.length > 2 ? currentEpisodeURL : cinemaRecord?.videoURL}
                                />
                            </div>
                        )}
                        {location.pathname.split("/")[1] == "movies" && !showPlayerSection && (
                            <div ref={playerRef}>
                                <PlayerSection
                                    videoURL={currentEpisodeURL.length > 2 ? currentEpisodeURL : cinemaRecord?.videoURL}
                                />
                            </div>
                        )}

                        {location.pathname.split("/")[1] == "series" && (
                            <EpisodesSection
                                playerRef={playerRef}
                                setShowPlayerSection={setShowPlayerSection}
                                setCurrentEpisodeURL={setCurrentEpisodeURL}
                                allEpisodes={(cinemaRecord as Series).allEpisodes}
                            />
                        )}

                        <CommentsSection
                            myData={myData}
                            currentCinemaRecordId={currentCinemaRecordId}
                        />

                        <img
                            className={style['background-img']}
                            src={constants.TMDB_IMG_URL + cinemaRecord?.backgroundImg_URL}
                            alt={cinemaRecord?.title}
                        />
                        <span className={style['background-img-shadow']}></span>

                        <Footer />
                    </article>
                )
            )}
        </>
    );
};
