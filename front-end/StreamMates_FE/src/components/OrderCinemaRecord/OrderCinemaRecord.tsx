import { useLocation, useNavigate } from "react-router-dom";
import style from "./OrderCinemaRecord.module.css";
import { useEffect } from "react";

export const OrderCinemaRecord = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("LAST_CINEMA_RECORDS");
        localStorage.removeItem("LAST_GENRES");
        localStorage.removeItem("ALL_LAST_MOVIES_COUNT");
        localStorage.removeItem("LAST_SEARCHED_TITLE");
        localStorage.removeItem("LAST_CURRENT_PAGE");
        
    }, [location.pathname]);

    const navigateToOrderSearchEngine = (event: React.MouseEvent<HTMLButtonElement>) => {
        const text = event.currentTarget.textContent?.trim();
        navigate(`/order/${text?.toLowerCase()}`);
    };


    return (
        <section className={style['order-cinema-record-container']}>

            <h3 className={style['order-h3-title']}>Order?</h3>
            <div className={style['order-buttons-container']}>
                <button
                    onClick={navigateToOrderSearchEngine}
                    className={style['order-button']}
                >
                    Movie
                </button>
                <button
                    onClick={navigateToOrderSearchEngine}
                    className={style['order-button']}
                >
                    Series
                </button>
            </div>
        </section>
    );
}