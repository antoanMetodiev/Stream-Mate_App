import style from "./ChannelLifeVideo.module.css";

interface ChannelLifeVideoProps {
    videoURL: string, 
    name: string
};

export const ChannelLifeVideo = ({
    videoURL, 
    name,
}: ChannelLifeVideoProps) => {


    console.log(name);
    return (
        <>
            <div className={style["video-container-wrapper"]}>
                <iframe
                    src={videoURL}
                    className="video responsive"
                    allowFullScreen
                    name="iframe_a"
                    width="100%"
                    height="100%"
                >
                    Your Browser Do not Support Iframe
                </iframe>
            </div>
            {/* <h2 className={style['channel-title']}>{name}</h2> */}
        </>
    );
};