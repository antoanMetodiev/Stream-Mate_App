import { constants } from "../../../../../../constants/constants";
import { Movie } from "../../../../../../types/MovieType";
import { Series } from "../../../../../../types/Series";
import { formatGenres, getRandomNumber } from "../../../../../../utils/utils";
import style from "./Details.module.css";

interface DetailsProps {
    cinemaRecord: (Movie | Series) | undefined;
}

export const Details = ({
    cinemaRecord
}: DetailsProps) => {



    return (
        <div className={style['details-container']}>
            <img
                className={style['poster-img']}
                src={constants.TMDB_IMG_URL + cinemaRecord?.posterImgURL}
                alt={cinemaRecord?.title}
            />

            <section className={style['data-container']}>
                {cinemaRecord?.title && (
                    <h2 className={style['title']}>
                        {cinemaRecord?.title} ({cinemaRecord?.releaseDate?.split("-")[0]})
                    </h2>
                )}
                {cinemaRecord?.specialText && (
                    <h4 className={style['special-text']}>
                        {"- " + cinemaRecord?.specialText}
                    </h4>
                )}
                {cinemaRecord?.description && (
                    <h4 className={style['description']}>
                        <h4 className={style['overview-h4']}>Overview</h4>
                        <span className={style['diff-color']}>
                            {cinemaRecord?.description.length > 377 ?
                                cinemaRecord?.description.slice(0, 377) + ".." : cinemaRecord?.description}
                        </span>
                    </h4>
                )}
                {cinemaRecord?.releaseDate && (
                    <h4 className={style['release-date']}>
                        Release Date: <span className={style['diff-color']}>{cinemaRecord?.releaseDate}</span>
                    </h4>
                )}
                {cinemaRecord?.genres && (
                    <h4 className={style['genres']}>
                        Genres: <span className={style['diff-color']}>{formatGenres(cinemaRecord?.genres)}</span>
                    </h4>
                )}
                {cinemaRecord?.tmdbRating && (
                    <h4 className={style['tmdb-rating']}>
                        TMDB Rating: <span className={style['diff-color']}>{cinemaRecord?.tmdbRating}</span>
                    </h4>
                )}
                {cinemaRecord && getRandomNumber() && (
                    <h4 className={style['default-views']}>
                        Rating: R • <span className={style['diff-color']}>{getRandomNumber()} views</span>
                    </h4>
                )}
            </section>

        </div>
    );
};