import { useNavigate } from "react-router-dom";
import { constants } from "../../../../constants/constants";
import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";
import style from "./CinemaRecord.module.css";

interface CinemaRecordProps {
    cinemaRecord: (Movie | Series) | undefined;
    cinemaRecordsList: (Movie | Series)[] | undefined;
    currentPaginationPage: number;
}

export const CinemaRecord = ({
    cinemaRecord,
    cinemaRecordsList,
    currentPaginationPage,
}: CinemaRecordProps) => {
    const navigate = useNavigate();

    const navigateToDetails = (cinemaRecord: (Movie | Series) | undefined): void => {
        debugger;
        localStorage.setItem("LAST_CINEMA_RECORDS", JSON.stringify(cinemaRecordsList));
        localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(currentPaginationPage));
        navigate(`${cinemaRecord?.id}`);
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
            />

            <div className={style['text-container']}>
                <h2>
                    {cinemaRecord && cinemaRecord?.title.length > 17
                        ? cinemaRecord?.title.substring(0, 17) + "..."
                        : cinemaRecord?.title}
                </h2>
                <h4>{cinemaRecord?.releaseDate} • Movie</h4>
            </div>
        </div>
    );
};