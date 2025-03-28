import style from "./TV_ChannelsComponent.module.css";
import backgroundImage from "./TV_ChannelsList/channel-images/details-background.jpg";

import { TV_ChannelsList } from "./TV_ChannelsList/TV_ChannelsList";
import { Header } from "../Movies/Header/Header";

export const TV_ChannelsComponent = () => {



    return (
        <article className={style['tv-channels-component-container']}>
            <Header setCinemaRecordsList={() => {}} />
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