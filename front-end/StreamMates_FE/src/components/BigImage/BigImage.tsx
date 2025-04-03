import style from "./BigImage.module.css";

interface BigImageProps {
    imageURL: string;
    imageType: string;
    setShowBigImage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BigImage = ({
    imageURL,
    imageType,
    setShowBigImage
}: BigImageProps) => {

    const closeImage = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).tagName === "DIV") {
            setShowBigImage(false);
        };
    };

    return (
        <div
            onClick={closeImage}
            className={style['big-image-container-wrapper']}
        >
            <span className={style['shadow']}></span>

            <img
                className={`${style[imageType.toLowerCase()]} ${style["big-image"]}`}
                src={imageURL}
                alt={imageType}
            />

            <img src="" alt="" />
        </div>
    );
};