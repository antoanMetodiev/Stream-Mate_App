import style from "./TV_ChannelsList.module.css";

import { TV_ChannelsData } from "./TV_ChannelsData";
import { TV_Channel } from "./TV_Channel/TV_Channel";

export const TV_ChannelsList = () => {


    return (
        <section className={style['tv-channels-list-container']}>
            {TV_ChannelsData.map(channel => {
                return (
                    <>
                        <TV_Channel
                            key={channel.posterImgURL}
                            posterImgURL={channel.posterImgURL}
                            name={channel.name}
                            videoURL={channel.videoURL}
                            imgList={channel.imgList}
                            description={channel.description}
                        />
                    </>
                )
            })}
        </section>
    );
};