import style from "./TV_ChannelDetails.module.css";
import { useLocation } from "react-router-dom";
import backgroundImage from "./../../channel-images/details-background.jpg";

import { Header } from "../../../../Movies/Header/Header";
import { ChannelLifeVideo } from "./ChannelLifeVideo/ChannelLiveVideo";
import { Footer } from "../../../../Footer/Footer";

export const TV_ChannelDetails = () => {
    const location = useLocation();
    const { name, videoURL } = location.state || {}; // Взимаме данните

    return (
        <section className={style['tv-channel-details-container-wrapper']}>
            <Header setCinemaRecordsList={() => { }} />
            <ChannelLifeVideo name={name} videoURL={videoURL} />

            <img
                className={style['details-background-img']}
                src={backgroundImage}
                alt="backgroundImage"
            />
            <span className={style['shadow']}></span>
            <Footer />
        </section>
    );
};