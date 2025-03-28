import { useLocation } from "react-router-dom";
import style from "./OrderEngine.module.css";
import { SearchEngine } from "../../Movies/Header/SearchEngine/SearchEngine";
import { useState } from "react";

export const OrderEngine = () => {
    const location = useLocation();
    const [inputValue, setInputValue] = useState("");
    const [messageText, setMessageText] = useState("Напишете филм или сериал, който искате да бъде добавен и след това ще може да го гледате от 10 до 30 секунди. За още по-бързи резултати, моля, напишете абсолютно точното име за него!");

    return (
        <div className={style['order-engine-container']}>

            <h3 className={style['order-cinema-record-title-h3']}>Order {location.pathname.includes("movie") ? "Movie" : "Series"}</h3>
            <div className={style['search-engine-wrapper-container']}>
                <SearchEngine
                    setMessageText={setMessageText}
                    setIsLoading={() => { }}
                    genres=""
                    inputValue={inputValue}
                    searchedMovieTitle=""
                    setAllMoviesCount={() => { }}
                    setCinemaRecordsList={() => { }}
                    setGenres={() => { }}
                    setInputValue={setInputValue}
                    setLastPathName={() => { }}
                    setSearchedMovieTitle={() => { }}
                    setCurrentPaginationPage={() => { }}
                />
            </div>

            <h3 className={style['message-text-h3']}>{messageText}</h3>
        </div>
    );
}