import style from "./ChannelDescriptionImage.module.css";

interface ChannelDescriptionImageProps {
    description: string,
    imgList: string[]
};

export const ChannelDescriptionImage = ({
    description,
    imgList,
}: ChannelDescriptionImageProps) => {


    return (
        <section className={style['channel-description-image-container']}>
            <div className={style['description-container-wrapper']}>
                <h2 className={style['title-h2']}>Description</h2>
                <h4 className={style['description']}>{description}</h4>
            </div>

            <div className={style['images-list-container-wrapper']}>
                <section className={style['images-list-container']}>
                    {imgList.map(imageURL => {
                        return (
                            <img
                                className={style['channel-image']}
                                src={imageURL}
                                alt={imageURL}
                            />
                        )
                    })}
                </section>
            </div>
        </section>
    );
};