import axios from "axios";
import style from "./Navigation.module.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "../../../../types/User";
import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";
import { useEffect } from "react";

interface NavigationProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
    setGenres: React.Dispatch<React.SetStateAction<string>>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    setSearchedMovieTitle: React.Dispatch<React.SetStateAction<string>>;
    setAllMoviesCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPaginationPage: React.Dispatch<React.SetStateAction<number>>;
};

export const Navigation = ({
    user,
    setUser,
    setCinemaRecordsList,
    setGenres,
    setInputValue,
    setAllMoviesCount,
    setSearchedMovieTitle,
    setCurrentPaginationPage
}: NavigationProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    
    const logout = async () => {
        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

        try {
            const response = await axios.delete(BASE_URL + "/logout", {
                withCredentials: true,
                headers: {
                    "X-Custom-Logout": "true",
                }
            });
            console.log("Logout successful:", response.data);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        };
    };


    const specialNavigateToCinemaRecord = (locationPath: string) => {
        debugger;
        if (location.pathname.includes(locationPath)) return; // Ако вече сме на този път, не правим нищо

        localStorage.removeItem("LAST_CINEMA_RECORDS");
        localStorage.removeItem("LAST_CURRENT_PAGE");
        localStorage.removeItem("LAST_GENRES");
        localStorage.removeItem("ALL_LAST_MOVIES_COUNT");
        localStorage.removeItem("LAST_SEARCHED_TITLE");

        if (setCinemaRecordsList) setCinemaRecordsList(undefined);
        setGenres("");
        setInputValue("");
        setSearchedMovieTitle("");
        setCurrentPaginationPage(1);
        setAllMoviesCount(0);
        navigate(locationPath);
    };

    return (
        <nav className={style['navigation-container']}>
            {!user && <Link to="/login" className={`${style['link']} ${location.pathname.includes("/login") ? style['active'] : ''}`}>Login</Link>}
            {!user && <Link to="/register" className={`${style['link']} ${location.pathname.includes("/register") ? style['active'] : ''}`}>Register</Link>}

            {user && (
                <h4
                    onClick={() => specialNavigateToCinemaRecord("/movies")}
                    className={`${style['link']} ${location.pathname.includes("/movies") ? style['active'] : ''}`}
                >
                    Movies
                </h4>
            )}

            {user && (
                <h4
                    onClick={() => specialNavigateToCinemaRecord("/series")}
                    className={`${style['link']} ${location.pathname.includes("/series") ? style['active'] : ''}`}
                >
                    Series
                </h4>
            )}

            {user && (
                <h4
                    onClick={() => navigate("/order-cinema-record")}
                    className={`${style['link']} ${location.pathname.includes("/order-cinema-record") ? style['active'] : ''}`}
                >
                    Order
                </h4>
            )}

            {user && <Link to="/tv-channels" className={`${style['link']} ${location.pathname.includes("/tv-channels") ? style['active'] : ''}`}>24/7 Channels</Link>}
            {user && <h4 onClick={logout} className={style['link']}>Logout</h4>}
        </nav>
    );
}