import style from "./GenreCategories.module.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { allGenres } from "../../../utils/utils";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Movie } from "../../../types/MovieType";
import { Series } from "../../../types/Series";

interface GenreCategoriesProps {
    genres: string;
    setGenres: React.Dispatch<React.SetStateAction<string>>;
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
    setAllMoviesCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPaginationPage: React.Dispatch<React.SetStateAction<number>>;
    setSearchedMovieTitle: React.Dispatch<React.SetStateAction<string>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export const GenreCategories = ({
    genres,
    setGenres,
    setAllMoviesCount,
    setCurrentPaginationPage,
    setSearchedMovieTitle,
    setInputValue
}: GenreCategoriesProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
    const additionalURL = location.pathname.includes("movies") ? "/get-movies-count-by-genre" : "/get-series-count-by-genre";

    const getCinemaRecordsByGenre = async (receivedGenre: string) => {
        debugger;
        if (genres === receivedGenre) {
           
            localStorage.removeItem("LAST_CURRENT_PAGE");
            localStorage.removeItem("LAST_CINEMA_RECORDS");
            localStorage.removeItem("LAST_GENRES");
            localStorage.removeItem("ALL_LAST_MOVIES_COUNT");
            localStorage.removeItem("LAST_SEARCHED_TITLE");
            setAllMoviesCount(0);
            setCurrentPaginationPage(1);
            setSearchedMovieTitle("");
            setGenres("");
            if (location.pathname.includes("movies")) navigate("/movies");
            else if (location.pathname.includes("series")) navigate("/series");
            return;
        }

        try {
            const apiResponse = await axios.get((BASE_URL + additionalURL), {
                withCredentials: true,
                params: { receivedGenre }
            });

            localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(1));
            localStorage.removeItem("LAST_CINEMA_RECORDS");
            localStorage.removeItem("LAST_GENRES");
            localStorage.removeItem("ALL_LAST_MOVIES_COUNT");
            localStorage.removeItem("LAST_SEARCHED_TITLE");
            
            setInputValue("");
            setCurrentPaginationPage(1);
            setSearchedMovieTitle("");
            setAllMoviesCount(apiResponse.data);
            setGenres(receivedGenre);
            if (location.pathname.includes("movies")) navigate("/movies/genres/" + receivedGenre);
            else if (location.pathname.includes("series")) navigate("/series/genres/" + receivedGenre);

        } catch (error) {
            console.log(error);
        };
    };


    return (
        <div className={style['genre-categories-container']}>
            <Swiper
                slidesPerView={6}
                spaceBetween={20}  // Разстояние между елементите
                pagination={{ enabled: false }}
                modules={[Pagination, Navigation]}
                className={style['mySwiper']}
            >
                {allGenres.map((genre, index) => (
                    <SwiperSlide key={index}>
                        <h3
                            onClick={() => getCinemaRecordsByGenre(genre)}
                            className={`${style['genre-card']} ${genres === genre ? style['active'] : ''}`}
                        >
                            {genre}
                        </h3>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
