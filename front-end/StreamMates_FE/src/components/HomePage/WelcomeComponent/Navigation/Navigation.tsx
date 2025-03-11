import axios from "axios";
import style from "./Navigation.module.css";

import { Link, useNavigate } from "react-router-dom";
import { User } from "../../../../types/User";
import { Movie } from "../../../../types/MovieType";
import { Series } from "../../../../types/Series";

interface NavigationProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
};

export const Navigation = ({
    user,
    setUser,
    setCinemaRecordsList,
}: NavigationProps) => {
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

    const specialNavigateToCinemaRecord = (location: string) => {
        debugger;
        localStorage.removeItem("LAST_CINEMA_RECORDS");
        localStorage.removeItem("LAST_CURRENT_PAGE");
        if (setCinemaRecordsList) setCinemaRecordsList(undefined);
        
        navigate(location);
    };

    return (
        <nav className={style['navigation-container']}>
            {!user && <Link to="/login" className={style['link']}>Login</Link>}
            {!user && <Link to="/register" className={style['link']}>Register</Link>}
            {user && <h4 onClick={() => specialNavigateToCinemaRecord("/movies")} className={style['link']}>Movies</h4>}
            {user && <h4 onClick={() => specialNavigateToCinemaRecord("/series")} className={style['link']}>Series</h4>} 
            {user && <Link to="/tv-channels" className={style['link']}>24/7 Channels</Link>}
            {user && <h4 onClick={logout} className={style['link']}>Logout</h4> }
        </nav>
    );
}