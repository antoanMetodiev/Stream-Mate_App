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
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
    const location = useLocation();
    const navigate = useNavigate();

    async function searchForMovies(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const inputElement = event.currentTarget.elements.namedItem("searchEngine") as HTMLInputElement;
        const title = inputElement.value;

        debugger;
        try {
            const apiResponse = await axios.get(`${BASE_URL}/get-movies-by-title`, {
                withCredentials: true,
                params: { title }
            });
            const movies: Movie[] = apiResponse.data as Movie[];
            console.log(movies);

            setCinemaRecordsList(movies);
            navigate("/movies/search/" + title);
        } catch (error) {
            console.log(error);
        };
    };

    async function searchForSeries(event: React.FormEvent<HTMLFormElement>) {
        debugger;
        event.preventDefault();
        const inputElement = event.currentTarget.elements.namedItem("searchEngine") as HTMLInputElement;
        const title = inputElement.value;

        try {
            const apiResponse = await axios.get(`${BASE_URL}/get-series-by-title`, {
                withCredentials: true,
                params: { title }
            });
            const series: Series[] = apiResponse.data as Series[];
            console.log(series);

            
            setCinemaRecordsList(series);
            setTimeout(() => {
                navigate("/series/search/" + title);
            }, 200);
            
        } catch (error) {
            console.log(error);
        };
    };


    return (
        <div className={style['search-container']}>
            <form onSubmit={location.pathname.includes("/movies") ? searchForMovies : searchForSeries}>
                <h3 className={style['search-h3']}>Search</h3>
                <input
                    className={style['search-engine']}
                    name="searchEngine"
                    type="text"
                />
            </form>
        </div>
    );

};