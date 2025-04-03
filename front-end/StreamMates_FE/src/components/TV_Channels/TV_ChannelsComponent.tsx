import style from "./TV_ChannelsComponent.module.css";
import backgroundImage from "./TV_ChannelsList/channel-images/details-background.webp";

import { TV_ChannelsList } from "./TV_ChannelsList/TV_ChannelsList";
import { Header } from "../Movies/Header/Header";

export const TV_ChannelsComponent = () => {


    return (
        <article className={style['tv-channels-component-container']}>
            <Header
                genres=""
                inputValue=""
                user={null}
                searchedMovieTitle=""
                setGenres={() => { }}
                setAllMoviesCount={() => { }}
                setCurrentPaginationPage={() => { }}
                setInputValue={() => { }}
                setSearchedMovieTitle={() => { }}
                setIsLoading={() => { }}
                setLastPathName={() => { }}
                setCinemaRecordsList={() => { }}
            />
            <TV_ChannelsList />

            <img
                className={style['details-background-img']}
                src={backgroundImage}
                alt="backgroundImage"
            />
            <span className={style['shadow']}></span>
        </article>
    );
};