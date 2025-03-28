import { useNavigate } from "react-router-dom";
import style from "./TV_Channel.module.css";

interface TV_ChannelProps {
    posterImgURL: string,
    name: string,
    videoURL: string,
};

export const TV_Channel = ({
    posterImgURL,
    name,
    videoURL,
}: TV_ChannelProps) => {
    const navigate = useNavigate();

    const navivageToDetails = () => {
        navigate(`/tv-channels/${name.split(" ").join("-")}`, {
            state: { name, posterImgURL, videoURL }
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