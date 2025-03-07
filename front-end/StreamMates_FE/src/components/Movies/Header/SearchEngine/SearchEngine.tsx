import axios from "axios";
import style from "./SearchEngine.module.css";

import { CinemaRecRequestDto } from "../../../../types/dtos/CinemaRequestDto";
import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchEngineProps {
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
};

export const SearchEngine = ({
    setCinemaRecordsList,
}: SearchEngineProps) => {
    const location = useLocation();
    const navigate = useNavigate();


    async function searchForMovies(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const inputElement = event.currentTarget.elements.namedItem("searchEngine") as HTMLInputElement;
        const recordName = inputElement.value;
        console.log(recordName);
        const requestData: CinemaRecRequestDto = { recordName };

        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

        try {
            const apiResponse = await axios.post(BASE_URL + "/get-movies", requestData, {
                withCredentials: true
            });
            const movies: Movie[] = apiResponse.data as Movie[];
            console.log(movies);

            setCinemaRecordsList(movies);
            navigate("/movies/search/" + recordName);
        } catch (error) {
            console.log(error);
        };
    };

    async function searchForSeries(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const inputElement = event.currentTarget.elements.namedItem("searchEngine") as HTMLInputElement;
        const recordName = inputElement.value;
        console.log(recordName);
        const requestData: CinemaRecRequestDto = { recordName };

        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

        try {
            const apiResponse = await axios.post(BASE_URL + "/get-series", requestData, {
                withCredentials: true
            });
            const series: Series[] = apiResponse.data as Series[];
            console.log(series);

            setCinemaRecordsList(series);
            navigate("/series/search/" + recordName);
        } catch (error) {
            console.log(error);
        };
    };



    return (
        <form onSubmit={location.pathname.includes("/movies") ? searchForMovies : searchForSeries}>
            <input
                className={style['search-engine']}
                name="searchEngine"
                type="text"
            />
        </form>
    );
};