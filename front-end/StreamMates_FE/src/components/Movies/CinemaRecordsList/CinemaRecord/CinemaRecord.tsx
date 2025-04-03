import { useLocation, useNavigate } from "react-router-dom";
import { constants } from "../../../../constants/constants";
import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";
import style from "./CinemaRecord.module.css";
import { User } from "../../../../types/User";

interface CinemaRecordProps {
    cinemaRecord: (Movie | Series) | undefined;
    cinemaRecordsList: (Movie | Series)[] | undefined;
    currentPaginationPage: number;
    genres: string;
    allMoviesCount: number;
    searchedMovieTitle: string;
    user: User | null;
}

export const CinemaRecord = ({
    cinemaRecord,
    cinemaRecordsList,
    currentPaginationPage,
    genres,
    allMoviesCount,
    searchedMovieTitle,
    user
}: CinemaRecordProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navigateToDetails = (cinemaRecord: (Movie | Series) | undefined): void => {
        localStorage.setItem("LAST_CINEMA_RECORDS", JSON.stringify(cinemaRecordsList));
        localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(currentPaginationPage));
        localStorage.setItem("LAST_GENRES", JSON.stringify(genres));
        localStorage.setItem("ALL_LAST_MOVIES_COUNT", JSON.stringify(allMoviesCount));
        localStorage.setItem("LAST_SEARCHED_TITLE", JSON.stringify(searchedMovieTitle));

        const cinemaRecordId = cinemaRecord?.id;
        
        if (location.pathname.includes("series")) {
            navigate(`/series/${cinemaRecord?.id}`, {
                state: { user, cinemaRecordId }
            });
        } else {
            navigate(`/movies/${cinemaRecord?.id}`, {
                state: { user, cinemaRecordId }
            });
        };
    };

    return (
        <div
            onClick={() => { navigateToDetails(cinemaRecord) }}
            className={style['cinema-record-container']}
        >
            <img
                className={style['poster-img']}
                src={constants.TMDB_IMG_URL + cinemaRecord?.posterImgURL}
                alt={cinemaRecord?.title}
                loading="lazy"
            />

            <div className={style['text-container']}>
                <h2>
                    {cinemaRecord && cinemaRecord?.title.length > 18
                        ? cinemaRecord?.title.substring(0, 18) + ".."
                        : cinemaRecord?.title}
                </h2>
                <h4>{cinemaRecord?.releaseDate} • {location.pathname.includes("movies") ? "Movie" : "Series"}</h4>
            </div>
        </div>
    );
};