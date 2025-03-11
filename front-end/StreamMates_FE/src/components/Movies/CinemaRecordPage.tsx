import style from "./CinemaRecordPage.module.css";
import axios from "axios";
import movieBackgroundImage from "./../../images/movie-background-image.jpg";
import seriesBackgroundImage from "./../../images/series-background-image.jpg";

import { Header } from "./Header/Header";
import { GenreCategories } from "./GenreCategories/GenreCategories";
import { CinemaRecordsList } from "./CinemaRecordsList/CinemaRecordsList";
import { Movie } from "../../types/MovieType";
import { Series } from "../../types/Series";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { User } from "../../types/User";
import { Pagination } from "./Pagination/Pagination";
import { Loader } from "../Loader/Loader";
import { Footer } from "../Footer/Footer";


interface CinemaRecordPageProps {
    user: User | null;
};

export const CinemaRecordPage = ({
    user,
}: CinemaRecordPageProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
    const location = useLocation();
    const [cinemaRecordsList, setCinemaRecordsList] = useState<Movie[] | Series[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false); // ✅ Добавяме `isLoading`

    const [currentPaginationPage, setCurrentPaginationPage] = useState<number>(
        localStorage.getItem("LAST_CURRENT_PAGE")
            ? Number(JSON.parse(localStorage.getItem("LAST_CURRENT_PAGE")!))
            : 1
    );
    const [allMoviesCount, setAllMoviesCount] = useState(0);
    const totalPages = allMoviesCount > 0 ? Math.ceil(allMoviesCount / 20) : 0; // Примерен брой страници

    useEffect(() => {
        setCurrentPaginationPage(1);  // Връща страницата на 1 при смяна на Movies/Series
    }, [location.pathname]);

    useEffect(() => {
        const additionalURL = location.pathname.includes("movies") ? "/get-all-movies-count" : "/get-all-series-count";
        const getAllCinemaRecordsCountHandler = async () => {
            try {
                const apiResponse = await axios.get((BASE_URL + additionalURL), { withCredentials: true });
                setAllMoviesCount(apiResponse.data);
            } catch (error) { console.log(error) };
        };

        getAllCinemaRecordsCountHandler();
    }, [location.pathname]);

    useEffect(() => {
        if (allMoviesCount === 0) return; // Изчаква броя на филмите да бъде зададен

        const additionalURL = location.pathname.includes("movies")
            ? "/get-next-thirty-movies"
            : "/get-next-thirty-series";

        const fetchFirst30CinemaRecords = async () => {
            setIsLoading(true); // ✅ Започваме зареждането
            let size = 20;
            const totalPages = Math.ceil(allMoviesCount / size);
    
            // Ако сме на последната страница, вземаме остатъка от записите
            if (currentPaginationPage === totalPages && allMoviesCount % size !== 0) {
                size = allMoviesCount % size;
            }

            // Вземане на кеширани стойности:
            const lastCurrentPageJson = localStorage.getItem("LAST_CURRENT_PAGE");
            const lastCurrentPage = lastCurrentPageJson ? Number(lastCurrentPageJson) : null;
            const storedDataJson = localStorage.getItem("LAST_CINEMA_RECORDS");
            const storedData = storedDataJson ? JSON.parse(storedDataJson) as (Movie[] | Series[]) : [];

            // Ако има кеширани данни, използвайте ги вместо да правите заявка
            if (lastCurrentPage !== null) {
                setCinemaRecordsList(storedData);
                localStorage.removeItem("LAST_CURRENT_PAGE");
                setIsLoading(false);
                return;
            }

            try {
                const apiResponse = await axios.get(
                    `${BASE_URL}${additionalURL}?page=${currentPaginationPage - 1}&size=${size}`,
                    { withCredentials: true }
                );
                console.log(apiResponse.data);
                setCinemaRecordsList(apiResponse.data.content);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            };
        };

        fetchFirst30CinemaRecords();
    }, [currentPaginationPage, allMoviesCount, location.pathname]); // Добавен `allMoviesCount` като зависимост

    useEffect(() => {
        if (cinemaRecordsList && cinemaRecordsList.length > 0) {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100); // Изчакваме малко време, за да позволим на DOM да се обнови
        }
    }, [cinemaRecordsList, location.pathname]);


    return (
        <>
            <img className={style['background-image']}
                src={location.pathname.includes("movie") ? movieBackgroundImage : seriesBackgroundImage}
                alt="backgroundImage"
            />
            <span className={style['shadow']}></span>

            <article className={style['cinema-record-page-container']}>
                <Header
                    user={user}
                    setCinemaRecordsList={setCinemaRecordsList}
                />
                <GenreCategories />
                {/* ✅ Показваме спинера, ако `isLoading` е `true` */}
                {isLoading ? (
                    <Loader /> 
                ) : (
                    cinemaRecordsList && (
                        <CinemaRecordsList
                            cinemaRecordsList={cinemaRecordsList}
                            currentPaginationPage={currentPaginationPage}
                        />
                    )
                )}

                {cinemaRecordsList && cinemaRecordsList.length > 0 && totalPages > 0 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPaginationPage={currentPaginationPage}
                        setCurrentPaginationPage={setCurrentPaginationPage}
                    />
                )}
            </article>
        </>
    );
}