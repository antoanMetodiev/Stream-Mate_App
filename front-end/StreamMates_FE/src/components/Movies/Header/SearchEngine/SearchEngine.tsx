import axios from "axios";
import style from "./SearchEngine.module.css";

import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import searchInputIcon from "./../../../../images/search-input.png";

interface SearchEngineProps {
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
    setLastPathName: React.Dispatch<React.SetStateAction<string>>;
    setAllMoviesCount: React.Dispatch<React.SetStateAction<number>>;
    searchedMovieTitle: string;
    setSearchedMovieTitle: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPaginationPage: React.Dispatch<React.SetStateAction<number>>;
    genres: string;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    setGenres: React.Dispatch<React.SetStateAction<string>>;
    setMessageText: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchEngine = ({
    setCinemaRecordsList,
    setAllMoviesCount,
    searchedMovieTitle,
    setSearchedMovieTitle,
    setIsLoading,
    setCurrentPaginationPage,
    inputValue,
    setInputValue,
    setGenres,
    setMessageText
}: SearchEngineProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if (window.location.href.includes("/search/")) {
            const title = searchedMovieTitle;
            const additionalURL = window.location.href.includes("movies") ? "/get-searched-movies-count" : "/get-searched-series-count";

            if (!title || title.trim().length == 0) {
                setSearchedMovieTitle("");
                setCinemaRecordsList(undefined);
                if (location.pathname.includes("movies")) navigate("/movies");
                else navigate("/series");
                return;
            };

            const getSearchedMoviesCount = async () => {
                setIsLoading(true);

                try {
                    const apiResponse = await axios.get(BASE_URL + additionalURL, {
                        withCredentials: true,
                        params: { title }
                    });

                    console.log(apiResponse.data);
                    localStorage.removeItem("LAST_CINEMA_RECORDS");
                    localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(1));
                    localStorage.removeItem("LAST_GENRES");
                    localStorage.setItem("ALL_LAST_MOVIES_COUNT", JSON.stringify(apiResponse.data));

                    setIsLoading(false);
                    setAllMoviesCount(apiResponse.data);

                } catch (error) {
                    console.log(error);
                };
            };

            getSearchedMoviesCount();

        };

    }, [location.pathname, searchedMovieTitle]);

    async function searchForSeries(event: React.FormEvent<HTMLFormElement | HTMLImageElement>) {
        event.preventDefault();
        const title = inputValue;

        if (!title || title.trim().length == 0) {
            setSearchedMovieTitle("");
            setCinemaRecordsList(undefined);
            if (location.pathname.includes("movies")) navigate("/movies");
            else navigate("/series");
            return;
        };

        try {
            const apiResponse = await axios.get(`${BASE_URL}/get-series-by-title`, {
                withCredentials: true,
                params: { title }
            });
            const series: Series[] = apiResponse.data as Series[];
            console.log(series);

            setCinemaRecordsList(series);
            localStorage.removeItem("LAST_CINEMA_RECORDS");
            localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(1));
            localStorage.removeItem("LAST_GENRES");
            localStorage.removeItem("ALL_LAST_MOVIES_COUNT");  // еднакво и movies и за series!

            setInputValue(title);
            setSearchedMovieTitle(title);
            setGenres("");
            setIsLoading(false);
            setCurrentPaginationPage(1);
            navigate("/series/search/" + title);
        } catch (error) {
            console.log(error);
        };
    };

    async function searchMovies(event: React.FormEvent<HTMLFormElement | HTMLImageElement>) {
        event.preventDefault();
        const title = inputValue;

        if (!title || title.trim().length == 0) {
            setSearchedMovieTitle("");
            setCinemaRecordsList(undefined);
            if (location.pathname.includes("movies")) navigate("/movies");
            else navigate("/series");
            return;
        };

        try {
            setIsLoading(true);
            const apiResponse = await axios.get(`${BASE_URL}/get-movies-by-title`, {
                withCredentials: true,
                params: { title }
            });
            const movies: Movie[] = apiResponse.data as Movie[];
            console.log(movies);

            setCinemaRecordsList(movies);
            localStorage.removeItem("LAST_CINEMA_RECORDS");
            localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(1));
            localStorage.removeItem("LAST_GENRES");
            localStorage.removeItem("ALL_LAST_MOVIES_COUNT");

            setInputValue(title);
            setSearchedMovieTitle(title);
            setGenres("");
            setIsLoading(false);
            setCurrentPaginationPage(1);
            navigate("/movies/search/" + title);

        } catch (error) {
            console.log(error);
        };
    };

    async function searchForSeriesInApi(event: React.FormEvent<HTMLFormElement | HTMLImageElement>) {
        event.preventDefault();
        const recordName = inputValue;
        if (!recordName || recordName.trim().length == 0) return;

        try {
            const apiResponse = await axios.post(`${BASE_URL}/search-series`, { recordName },
                { withCredentials: true });
            const series: Series[] = apiResponse.data as Series[];
            console.log(series);

        } catch (error) {
            console.log(error);
        };
    };

    async function searchForMoviesInApi(event: React.FormEvent<HTMLFormElement | HTMLImageElement>) {
        event.preventDefault();
        const recordName = inputValue;
        if (!recordName || recordName.trim().length == 0) return;

        try {
            const apiResponse = await axios.post(`${BASE_URL}/search-movies`, { recordName },
                { withCredentials: true });
            const movies: Movie[] = apiResponse.data as Movie[];
            console.log(movies);
        } catch (error) {
            console.log(error);
        };
    };

    const sendOperation = (event: React.FormEvent<HTMLFormElement | HTMLImageElement>) => {
        if (location.pathname == "/order/movie") {
            // FROM API!
            searchForMoviesInApi(event);
        } else if (location.pathname == "/order/series") {
            // FROM API!
            searchForSeriesInApi(event);
        } else if (location.pathname.includes("movie")) {
            // FROM Database!
            searchMovies(event);
        } else if (location.pathname.includes("series")) {
            // FROM Database!
            searchForSeries(event);
        } else {
            return;
        }

        setMessageText("Моля изчакайте..");
        setTimeout(() => {
            setMessageText("Заявката е изпратена и започна добавяне на резултати. Може да проверите в съответния каталог за филми/сериали до 10 или 30 секунди дали е добавен!    Благодарим Ви, че използвате Stream Mate!");
        }, 2000);
    };

    return (
        <div className={style['search-container']}>
            <form onSubmit={sendOperation}>
                {!location.pathname.includes("order") && <h3 className={style['search-h3']}>Search</h3>}
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={style['search-engine']}
                    name="searchEngine"
                    type="text"
                    placeholder={location.pathname.includes("order") ? "Order" : "Search..."}
                />
                <button hidden></button>
            </form>

            <img
                onClick={sendOperation}
                className={style['searchInputIcon']}
                src={searchInputIcon}
                alt="searchInputIcon"
            />
        </div>
    );

};