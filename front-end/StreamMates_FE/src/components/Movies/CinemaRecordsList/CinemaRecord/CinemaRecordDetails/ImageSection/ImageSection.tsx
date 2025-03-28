import { useEffect, useState, useRef } from "react";
import { constants } from "../../../../../../constants/constants";
import { MovieImage } from "../../../../../../types/MovieImage";
import { SeriesImage } from "../../../../../../types/SeriesImage";
import style from "./ImageSection.module.css";
import { getImagesByTypeAndRange } from "../../../../../../utils/utils";

import { BigImage } from "../../../../../BigImage/BigImage";
import { useInView } from 'react-intersection-observer';

interface ImageSectionProps {
    imagesList: (MovieImage[] | SeriesImage[]) | undefined;
};

export const ImageSection = ({
    imagesList
}: ImageSectionProps) => {
    const [backdropImages, setBackdropImages] = useState<(MovieImage | SeriesImage)[] | undefined>([]);
    const [posterImages, setPosterImages] = useState<(MovieImage | SeriesImage)[] | undefined>([]);
    const [currentImageType, setCurrentImageType] = useState("BACKDROP");

    const [showBigImage, setShowBigImage] = useState(false);

    // Counts:
    const [allBackdropImagesCount, setAllBackdropImagesCount] = useState<(MovieImage | SeriesImage)[] | undefined>([]);
    const [allPosterImagesCount, setAllPosterImagesCount] = useState<(MovieImage | SeriesImage)[] | undefined>([]);

    // Refs:
    const imageURLForBigImageComponentRef = useRef("");
    const imageTypeForBigImageComponentRef = useRef("");
    const backdropButtonRef = useRef<HTMLButtonElement>(null);
    const posterButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Counts:
        setAllBackdropImagesCount(getImagesByTypeAndRange(imagesList, "BACKDROP", 0, undefined));
        setAllPosterImagesCount(getImagesByTypeAndRange(imagesList, "POSTER", 0, undefined));

        setBackdropImages(getImagesByTypeAndRange(imagesList, "BACKDROP", 0, 4));
        setPosterImages(getImagesByTypeAndRange(imagesList, "POSTER", 0, 4));
    }, []);


    // Functions:
    const handleMouseEnter = (buttonRef: React.RefObject<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const exp = (currentImageType + "s").toLocaleLowerCase();
            // Проверяваме дали бутонът е за текущия тип изображение
            if (exp !== buttonRef.current.textContent?.toLocaleLowerCase()) {
                buttonRef.current.style.backgroundColor = "#626761";
            }
        }
    };

    const handleMouseLeave = (buttonRef: React.RefObject<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const exp = (currentImageType + "s").toLocaleLowerCase();
            // Проверяваме дали бутонът е за текущия тип изображение
            if (exp !== buttonRef.current.textContent?.toLocaleLowerCase()) {
                buttonRef.current.style.backgroundColor = "#0000007c";
            }
        }
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonText = (event.target as HTMLButtonElement).textContent; // Принудително типизиране

        // Обработка за бутоните Backdrops и Posters
        if (buttonText === "Backdrops") {
            if (backdropButtonRef.current && posterButtonRef.current) {
                backdropButtonRef.current.style.backgroundColor = "#ffffff4b";
                backdropButtonRef.current.style.borderColor = "#fff";

                posterButtonRef.current.style.backgroundColor = "#0000007c";
                posterButtonRef.current.style.borderColor = "#ffffff4b";
            }

            setCurrentImageType("BACKDROP");
        } else if (buttonText === "Posters") {
            if (backdropButtonRef.current && posterButtonRef.current) {
                backdropButtonRef.current.style.backgroundColor = "#0000007c";
                backdropButtonRef.current.style.borderColor = "#ffffff4b";

                posterButtonRef.current.style.backgroundColor = "#ffffff4b";
                posterButtonRef.current.style.borderColor = "#fff";
            }

            setCurrentImageType("POSTER");
        };
    };

    const loadMoreImages = () => {
        if (backdropImages == undefined || posterImages == undefined) return;

        let endIndex = 0;
        if (currentImageType == "BACKDROP") {
            endIndex = backdropImages?.length + 8;
            setBackdropImages(getImagesByTypeAndRange(imagesList, "BACKDROP", 0, endIndex));
        } else {
            endIndex = posterImages?.length + 8;
            setPosterImages(getImagesByTypeAndRange(imagesList, "POSTER", 0, endIndex));
        };
    };


    const showBigImageHandler = (imageType: string, imageURL: string) => {
        imageURLForBigImageComponentRef.current = imageURL;
        imageTypeForBigImageComponentRef.current = imageType;
        setShowBigImage(true);
    };

    const { ref, inView } = useInView({
        triggerOnce: true, // само веднъж когато влезе в изглед
        threshold: 0.5, // когато 50% от елемента е видим
    });


    return (
        <section
            ref={ref}
            className={`${style['image-section-container']} ${inView ? style['visible'] : ''}`}>

            <h3 className={`${style['images-title-h3']} ${inView ? style['visible'] : ''}`}>Images</h3>
            {showBigImage &&
                <>
                    <BigImage
                        imageURL={imageURLForBigImageComponentRef.current}
                        imageType={imageTypeForBigImageComponentRef.current}
                        setShowBigImage={setShowBigImage}
                    />
                </>
            }

            <div className={style['backdrop-poster-container-wrapper']}>
                <button
                    ref={backdropButtonRef}
                    onMouseEnter={() => handleMouseEnter(backdropButtonRef)}
                    onMouseLeave={() => handleMouseLeave(backdropButtonRef)}
                    onClick={handleButtonClick}
                    className={style['backdrop-button']}
                >
                    Backdrops
                </button>
                <button
                    ref={posterButtonRef}
                    onMouseEnter={() => handleMouseEnter(posterButtonRef)}
                    onMouseLeave={() => handleMouseLeave(posterButtonRef)}
                    onClick={handleButtonClick}
                    className={style['poster-button']}
                >
                    Posters
                </button>
            </div>

            <div className={style['image-list-container']}>
                {currentImageType === "BACKDROP" && backdropImages?.map((image, index) => (
                    <img
                        onClick={() => showBigImageHandler("BACKDROP", constants.TMDB_IMG_URL + image.imageURL)}
                        className={`${style['backdrop-image']} ${inView ? style['animate-visible'] : ''}`}
                        src={constants.TMDB_IMG_URL + image.imageURL}
                        alt={image.imageType}
                        key={index}
                    />
                ))}
                {currentImageType === "POSTER" && posterImages?.map((image, index) => (
                    <img
                        onClick={() => showBigImageHandler("POSTER", constants.TMDB_IMG_URL + image.imageURL)}
                        className={`${style['poster-image']} ${inView ? style['animate-visible'] : ''}`}
                        src={constants.TMDB_IMG_URL + image.imageURL}
                        alt={image.imageType}
                        key={index}
                    />
                ))}
            </div>

            {currentImageType === "BACKDROP"
                ? (backdropImages?.length === allBackdropImagesCount?.length
                    ? <button
                        onClick={() => setBackdropImages(getImagesByTypeAndRange(imagesList, "BACKDROP", 0, 4))}
                        className={style['load-more-button']}>
                        Show Less
                    </button>
                    : <button
                        onClick={loadMoreImages}
                        className={style['load-more-button']}>
                        Load More
                    </button>)
                : (posterImages?.length === allPosterImagesCount?.length
                    ? <button
                        onClick={() => setPosterImages(getImagesByTypeAndRange(imagesList, "POSTER", 0, 4))}
                        className={style['load-more-button']}>
                        Show Less
                    </button>
                    :
                    <button
                        onClick={loadMoreImages}
                        className={style['load-more-button']}>
                        Load More
                    </button>
                )
            }
        </section>
    );
};
