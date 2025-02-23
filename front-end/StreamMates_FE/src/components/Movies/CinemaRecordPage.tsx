import style from "./CinemaRecordPage.module.css";

import { Header } from "./Header/Header";
import { GenreCategories } from "./GenreCategories/GenreCategories";
import { CinemaRecordsList } from "./CinemaRecordsList/CinemaRecordsList";
import { Movie } from "../../types/MovieType";
import { Series } from "../../types/Series";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const CinemaRecordPage = () => {
    const location = useLocation();
    const [cinemaRecordsList, setCinemaRecordsList] = useState<Movie[] | Series[] | undefined>(undefined);

    useEffect(() => {
        debugger;
        let LAST_CINEMA_RECORDS: Movie[] | Series[] | undefined;

        try {
            const storedData = localStorage.getItem("LAST_CINEMA_RECORDS");
            if (storedData) {
                LAST_CINEMA_RECORDS = JSON.parse(storedData) as (Movie[] | Series[]);
                setCinemaRecordsList(LAST_CINEMA_RECORDS);
            }
        } catch (error) {
            console.log(error);
        };

    }, [location]);


    return (
        <article className={style['cinema-record-page-container']}>
            <Header setCinemaRecordsList={setCinemaRecordsList} />
            <GenreCategories />
            {cinemaRecordsList !== undefined && (
                <CinemaRecordsList cinemaRecordsList={cinemaRecordsList} />
            )}
        </article>
    );
}