import style from "./Header.module.css";

import { useLocation } from "react-router-dom";

import { TitleLogoComponent } from "../../HomePage/WelcomeComponent/TitleLogoComponent/TitleLogoComponent";
import { SearchEngine } from "./SearchEngine/SearchEngine";
import { Movie } from "../../../types/MovieType";
import { Series } from "../../../types/Series";

import { Navigation } from "../../HomePage/WelcomeComponent/Navigation/Navigation";

interface HeaderProps {
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
};

export const Header = ({
    setCinemaRecordsList
}: HeaderProps) => {
    const location = useLocation();

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

            <Navigation />
        </div>
    );
}