import { useNavigate } from "react-router-dom";
import { constants } from "../../../../constants/constants";
import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";
import style from "./CinemaRecord.module.css";

interface CinemaRecordProps {
    cinemaRecord: (Movie | Series) | undefined;
    cinemaRecordsList: (Movie | Series)[] | undefined;
}

export const CinemaRecord = ({
    cinemaRecord,
    cinemaRecordsList
}: CinemaRecordProps) => {
    const navigate = useNavigate();

    const navigateToDetails = (cinemaRecord: (Movie | Series) | undefined): void => {
        debugger;
        localStorage.setItem("LAST_CINEMA_RECORDS", JSON.stringify(cinemaRecordsList));
        navigate(`${cinemaRecord?.id}`, { state: { cinemaRecord } });
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
            <h2>
                {cinemaRecord && cinemaRecord?.title.length > 20
                    ? cinemaRecord?.title.substring(0, 20) + "..."
                    : cinemaRecord?.title}
            </h2>
            <h4>{cinemaRecord?.releaseDate} • Movie</h4>
        </div>
    );
};