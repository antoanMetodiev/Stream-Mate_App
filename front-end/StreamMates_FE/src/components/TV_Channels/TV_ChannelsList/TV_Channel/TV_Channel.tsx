import { useNavigate } from "react-router-dom";
import style from "./TV_Channel.module.css";

interface TV_ChannelProps {
    posterImgURL: string,
    name: string,
    videoURL: string,
    description: string,
    imgList: string[],
};

export const TV_Channel = ({
    posterImgURL,
    name,
    videoURL,
    description,
    imgList,
}: TV_ChannelProps) => {
    const navigate = useNavigate();

    const navivageToDetails = () => {
        navigate(`/tv-channels/${name.split(" ").join("-")}`, {
            state: { name, posterImgURL, videoURL, description, imgList }
        });
    };

    return (
        <div
            onClick={navivageToDetails}
            className={style['tv-channel-container']}
        >
            <img
                className={style['img-poster']}
                src={posterImgURL}
                alt={posterImgURL}
            />
            <h2>{name}</h2>
        </div>
    );
};