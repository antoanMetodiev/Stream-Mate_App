import axios from "axios";
import style from "./Navigation.module.css";

import { Link } from "react-router-dom";
import { User } from "../../../../types/User";

interface NavigationProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const Navigation = ({
    user,
    setUser,
}: NavigationProps) => {


    const logout = async () => {
        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
        
        try {
            const response = await axios.delete(BASE_URL + "/logout", {
                withCredentials: true,
                headers: {
                    "X-Custom-Logout": "true" // 👈 Case-sensitive!
                }
            });
            console.log("Logout successful:", response.data);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        };
    };


    return (
        <nav className={style['navigation-container']}>
            {!user && <Link to="/login" className={style['link']}>Login</Link>}
            {!user && <Link to="/register" className={style['link']}>Register</Link>}
            {user && <Link to="/movies" className={style['link']}>Movies</Link>}
            {user && <Link to="/series" className={style['link']}>Series</Link>} 
            {user && <Link to="/tv-channels" className={style['link']}>24/7 Channels</Link>}
            {user && <button onClick={logout} className={style['link']}>Logout</button> }
        </nav>
    );
}