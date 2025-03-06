import style from "./TV_ChannelDetails.module.css";
import { useLocation } from "react-router-dom";
import backgroundImage from "./../../channel-images/details-background.jpg";

import { Header } from "../../../../Movies/Header/Header";
import { ChannelLifeVideo } from "./ChannelLifeVideo/ChannelLiveVideo";
import { ChannelDescriptionImage } from "./ChannelDescriptionImage/ChannelDescriptionImage";

export const TV_ChannelDetails = () => {
    const location = useLocation();
    const { name, posterImgURL, videoURL, description, imgList } = location.state || {}; // Взимаме данните

    console.log(posterImgURL);
    return (
        <section className={style['tv-channel-details-container-wrapper']}>
            <Header setCinemaRecordsList={() => { }} />
            <ChannelLifeVideo name={name} videoURL={videoURL} />
            <ChannelDescriptionImage description={description} imgList={imgList} />

            <img
                className={style['details-background-img']}
                src={backgroundImage}
                alt="backgroundImage"
            />
            <span className={style['shadow']}></span>
        </section>
    );
};