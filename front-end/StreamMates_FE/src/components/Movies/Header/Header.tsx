import style from "./Header.module.css";

import { useLocation } from "react-router-dom";

import { TitleLogoComponent } from "../../HomePage/WelcomeComponent/TitleLogoComponent/TitleLogoComponent";
import { SearchEngine } from "./SearchEngine/SearchEngine";
import { Movie } from "../../../types/MovieType";
import { Series } from "../../../types/Series";

import { Navigation } from "../../HomePage/WelcomeComponent/Navigation/Navigation";
import { User } from "../../../types/User";
import { useEffect, useRef } from "react";

interface HeaderProps {
    user: User | null;
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
    setLastPathName: React.Dispatch<React.SetStateAction<string>>;
    setAllMoviesCount: React.Dispatch<React.SetStateAction<number>>;
    searchedMovieTitle: string;
    setSearchedMovieTitle: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPaginationPage: React.Dispatch<React.SetStateAction<number>>;
    genres: string,
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    setGenres: React.Dispatch<React.SetStateAction<string>>;
};

export const Header = ({
    user,
    genres,
    setCinemaRecordsList,
    setLastPathName,
    setAllMoviesCount,
    searchedMovieTitle,
    setSearchedMovieTitle,
    setIsLoading,
    setCurrentPaginationPage,
    inputValue,
    setInputValue,
    setGenres,
}: HeaderProps) => {
    const location = useLocation();
    const pathNameRef = useRef(location.pathname);

    useEffect(() => {
        pathNameRef.current = location.pathname;
    }, [location.pathname]);

    // Извличаме последния сегмент от pathname
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    const lastSegment = pathSegments[pathSegments.length - 1]; // Последния сегмент

    const showNavigationLinks =
        lastSegment === "movies" ||
        lastSegment === "series" ||
        pathSegments[pathSegments.length - 2] === "search" || pathSegments[pathSegments.length - 2] === "genres";

    return (
        <div className={style['navigation-container']}>
            <TitleLogoComponent />
            {showNavigationLinks && (
                <SearchEngine
                    setMessageText={() => {}}
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
            )}

            {showNavigationLinks && (
                <Navigation
                    user={user}
                    setUser={() => { }}
                    setCinemaRecordsList={setCinemaRecordsList}
                    setGenres={setGenres}
                    setInputValue={setInputValue}
                    setSearchedMovieTitle={setSearchedMovieTitle}
                    setAllMoviesCount={setAllMoviesCount}
                    setCurrentPaginationPage={setCurrentPaginationPage}
                />
            )}
        </div>
    );
}