import { Movie } from "../../../types/MovieType";
import { Series } from "../../../types/Series";
import { CinemaRecord } from "./CinemaRecord/CinemaRecord";
import style from "./CinemaRecordsList.module.css";

interface CinemaRecordsListProps {
    cinemaRecordsList: (Movie | Series)[] | undefined;
}

export const CinemaRecordsList = ({
    cinemaRecordsList
}: CinemaRecordsListProps) => {


    return (
        <section className={style["cinema-record-list-container"]}>
            {cinemaRecordsList && cinemaRecordsList?.map((cinemaRecord) => (
                <CinemaRecord
                    key={cinemaRecord.id}
                    cinemaRecord={cinemaRecord}
                    cinemaRecordsList={cinemaRecordsList}
                />
            ))}
        </section>
    );
};