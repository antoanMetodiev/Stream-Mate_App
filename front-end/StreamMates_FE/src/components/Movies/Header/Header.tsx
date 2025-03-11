import style from "./Header.module.css";

import { useLocation } from "react-router-dom";

import { TitleLogoComponent } from "../../HomePage/WelcomeComponent/TitleLogoComponent/TitleLogoComponent";
import { SearchEngine } from "./SearchEngine/SearchEngine";
import { Movie } from "../../../types/MovieType";
import { Series } from "../../../types/Series";

import { Navigation } from "../../HomePage/WelcomeComponent/Navigation/Navigation";
import { User } from "../../../types/User";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
    user: User | null;
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
};

export const Header = ({
    user,
    setCinemaRecordsList
}: HeaderProps) => {
    const location = useLocation();
    const pathNameRef = useRef(location.pathname);

    useEffect(() => {
        debugger;
        pathNameRef.current = location.pathname;
    }, [location.pathname]);

    // Извличаме последния сегмент от pathname
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    const lastSegment = pathSegments[pathSegments.length - 1]; // Последния сегмент

    const showNavigationLinks =
        lastSegment === "movies" ||
        lastSegment === "series" ||
        pathSegments[pathSegments.length - 2] === "search";

    return (
        <div className={style['navigation-container']}>
            <TitleLogoComponent />
            {showNavigationLinks && (
                <SearchEngine
                    setCinemaRecordsList={setCinemaRecordsList}
                />
            )}

            {pathNameRef.current.split("/").length == 2 && (
                <Navigation
                    user={user}
                    setUser={() => { }}
                    setCinemaRecordsList={setCinemaRecordsList}
                />
            )}
        </div>
    );
}