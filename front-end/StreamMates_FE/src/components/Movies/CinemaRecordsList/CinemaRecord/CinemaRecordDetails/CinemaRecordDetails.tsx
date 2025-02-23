import { useReducer, useRef, useState } from "react";
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

export const CinemaRecordDetails = () => {
    const location = useLocation();
    const [cinemaRecord, setCinemaRecord] = useState<Movie | Series | undefined>(useLocation().state?.cinemaRecord);
    const [showPlayerSection, setShowPlayerSection] = useState<boolean>(!location.pathname.includes("/series/"));
    const [currentEpisodeURL, setCurrentEpisodeURL] = useState("");

    // Refs:
    const playerRef = useRef<HTMLDivElement | null>(null);


    return (
        <article className={style['cinema-record-details-container']}>
            <Header />
            <Details cinemaRecord={cinemaRecord} />
            <CastSection cinemaRecord={cinemaRecord} />
            {cinemaRecord?.imagesList && <ImageSection imagesList={cinemaRecord?.imagesList} />}
            {showPlayerSection && (
                <>
                    <div ref={playerRef}>
                        <PlayerSection
                            videoURL={currentEpisodeURL.length > 2 ? currentEpisodeURL : cinemaRecord?.videoURL}
                        />
                    </div>
                </>
            )}
            {location.pathname.split("/")[1] == "movies" && !showPlayerSection && (
                <>
                    <div ref={playerRef}>
                        <PlayerSection
                            videoURL={currentEpisodeURL.length > 2 ? currentEpisodeURL : cinemaRecord?.videoURL}
                        />
                    </div>
                </>
            )}


            {location.pathname.split("/")[1] == "series" && (
                <>
                    <EpisodesSection
                        playerRef={playerRef}
                        setShowPlayerSection={setShowPlayerSection}
                        setCurrentEpisodeURL={setCurrentEpisodeURL}
                        allEpisodes={(cinemaRecord as Series).allEpisodes}
                    />
                </>
            )}

            <img
                className={style['background-img']}
                src={constants.TMDB_IMG_URL + cinemaRecord?.backgroundImg_URL}
                alt={cinemaRecord?.title}
            />
            <span className={style['background-img-shadow']}></span>
        </article>
    );
};