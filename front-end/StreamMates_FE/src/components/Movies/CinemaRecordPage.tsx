import style from "./CinemaRecordPage.module.css";
import axios from "axios";
import movieBackgroundImage from "./../../images/movie-background-image.webp";
import seriesBackgroundImage from "./../../images/series-background-image.webp";

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
import { BehindElement } from "./BehindElelement/BehindElement";

interface CinemaRecordPageProps {
    user: User | null;
};

export const CinemaRecordPage = ({
    user,
}: CinemaRecordPageProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
    let location = useLocation();
    const [cinemaRecordsList, setCinemaRecordsList] = useState<Movie[] | Series[] | undefined>(localStorage.getItem("LAST_CINEMA_RECORDS") ? JSON.parse(localStorage.getItem("LAST_CINEMA_RECORDS")!) : undefined);
    const [isLoading, setIsLoading] = useState(false); // ✅ Добавяме `isLoading`
    const [lastPathName, setLastPathName] = useState("");
    const [genres, setGenres] = useState(localStorage.getItem("LAST_GENRES") ? JSON.parse(localStorage.getItem("LAST_GENRES")!) : "");
    const [searchedMovieTitle, setSearchedMovieTitle] = useState(localStorage.getItem("LAST_SEARCHED_TITLE") ? JSON.parse(localStorage.getItem("LAST_SEARCHED_TITLE")!) : "");
    const [inputValue, setInputValue] = useState(localStorage.getItem("LAST_SEARCHED_TITLE") ? JSON.parse(localStorage.getItem("LAST_SEARCHED_TITLE")!) : "");

    const [currentPaginationPage, setCurrentPaginationPage] = useState<number>(
        localStorage.getItem("LAST_CURRENT_PAGE")
            ? Number(JSON.parse(localStorage.getItem("LAST_CURRENT_PAGE")!))
            : 1
    );
    const [allMoviesCount, setAllMoviesCount] = useState(localStorage.getItem("ALL_LAST_MOVIES_COUNT") ? JSON.parse(localStorage.getItem("ALL_LAST_MOVIES_COUNT")!) : 0);
    const totalPages = allMoviesCount > 0 ? Math.ceil(allMoviesCount / 20) : 0; // Примерен брой страници

    console.log(lastPathName);
    useEffect(() => {
        debugger;
        if (genres.length == 0) return;
        if (searchedMovieTitle.length > 0) return;
        const additionalURL = location.pathname.includes("movies") ? "/get-next-twenty-movies-by-genre" : "/get-next-twenty-series-by-genre";

        const exp: Movie[] | Series[] = JSON.parse(localStorage.getItem("LAST_CINEMA_RECORDS")!);
        if (localStorage.getItem("LAST_CINEMA_RECORDS") && exp.length > 0) {
            return;
        };

        const getAnotherCinemaRecordsByGenres = async () => {
            setIsLoading(true); // ✅ Започваме зареждането
            const size = 20;
            const receivedGenre = genres;

            try {
                const apiReponse = await axios.get((BASE_URL + additionalURL + `?page=${currentPaginationPage - 1}&size=${size}`), {
                    withCredentials: true,
                    params: { receivedGenre }
                });

                console.log(apiReponse.data);
                localStorage.removeItem("LAST_CINEMA_RECORDS");
                localStorage.removeItem("LAST_GENRES");
                localStorage.removeItem("ALL_LAST_MOVIES_COUNT");
                localStorage.removeItem("LAST_SEARCHED_TITLE");
                localStorage.removeItem("LAST_CURRENT_PAGE");

                setCinemaRecordsList(apiReponse.data);
                setIsLoading(false);

            } catch (error) {
                console.log(error);
            };
        };

        getAnotherCinemaRecordsByGenres();

    }, [genres, currentPaginationPage]);



    useEffect(() => {
        debugger;
        if (genres.length > 0) return;
        if (searchedMovieTitle.length > 0) return;

        const additionalURL = location.pathname.includes("movies") ? "/get-all-movies-count" : "/get-all-series-count";
        const getAllCinemaRecordsCountHandler = async () => {
            try {
                const apiResponse = await axios.get((BASE_URL + additionalURL), { withCredentials: true });
                setAllMoviesCount(apiResponse.data);
            } catch (error) { console.log(error) };
        };

        setLastPathName(location.pathname);
        getAllCinemaRecordsCountHandler();

    }, [location.pathname, genres, searchedMovieTitle]);

    useEffect(() => {
        debugger;
        if (allMoviesCount === 0) return; // Изчаква броя на филмите да бъде зададен
        if (genres.length > 0) return;
        if (searchedMovieTitle.length > 0) return;

        // Вземане на кеширани стойности:
        const lastCurrentPageJson = localStorage.getItem("LAST_CURRENT_PAGE");
        const lastCurrentPage = lastCurrentPageJson ? Number(lastCurrentPageJson) : null;
        const storedDataJson = localStorage.getItem("LAST_CINEMA_RECORDS");
        const storedData = storedDataJson ? JSON.parse(storedDataJson) as (Movie[] | Series[]) : [];

        // Ако има кеширани данни, използвайте ги вместо да правите заявка
        if (lastCurrentPage !== null && storedData.length > 0) {
            setCinemaRecordsList(storedData);
            setCurrentPaginationPage(lastCurrentPage);
            // localStorage.removeItem("LAST_CURRENT_PAGE");
            setIsLoading(false);
            return;
        }

        // Не презареждай, ако сме в `search` или детайлите на филм/сериал
        if (location.pathname.includes("/search/") || location.pathname.includes("/movies/") || location.pathname.includes("/series/")) return;

        const additionalURL = location.pathname.includes("movies")
            ? "/get-next-thirty-movies"
            : "/get-next-thirty-series";

        const fetchFirst30CinemaRecords = async () => {
            setIsLoading(true); // ✅ Започваме зареждането
            let size = 20;

            try {
                const apiResponse = await axios.get(
                    `${BASE_URL}${additionalURL}?page=${currentPaginationPage - 1}&size=${size}`,
                    { withCredentials: true }
                );
                console.log(apiResponse.data);
                setCinemaRecordsList(apiResponse.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            };
        };

        fetchFirst30CinemaRecords();
    }, [currentPaginationPage, allMoviesCount, location.pathname, genres]); // Добавен `allMoviesCount` като зависимост

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
                    genres={genres}
                    setGenres={setGenres}
                    setIsLoading={setIsLoading}
                    setCinemaRecordsList={setCinemaRecordsList}
                    setLastPathName={setLastPathName}
                    setAllMoviesCount={setAllMoviesCount}
                    searchedMovieTitle={searchedMovieTitle}
                    setSearchedMovieTitle={setSearchedMovieTitle}
                    setCurrentPaginationPage={setCurrentPaginationPage}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />

                <GenreCategories
                    genres={genres}
                    setGenres={setGenres}
                    setSearchedMovieTitle={setSearchedMovieTitle}
                    setAllMoviesCount={setAllMoviesCount}
                    setCinemaRecordsList={setCinemaRecordsList}
                    setCurrentPaginationPage={setCurrentPaginationPage}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />

                {/* ✅ Показваме спинера, ако `isLoading` е `true` */}

                {isLoading ? (
                    <>
                        <Loader />
                        <BehindElement />
                    </>
                ) : (
                    cinemaRecordsList && (
                        <CinemaRecordsList
                            user={user}
                            genres={genres}
                            searchedMovieTitle={searchedMovieTitle}
                            allMoviesCount={allMoviesCount}
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

                {cinemaRecordsList !== undefined && <Footer />}
            </article>
        </>
    );
}