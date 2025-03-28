import { User } from "../../../../../../../types/User";
import style from "./UserPictures.module.css";

import { ImageUploader } from "../../../../../../ImageUploader/ImageUploader";
import { useState } from "react";
import { BigImage } from "../../../../../../BigImage/BigImage";
import { UserImage } from "../../../../../../../types/UserImage";

interface UserPicturesProps {
    userOwner: User | null;
    myData: User | null;
    setUserOwner: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserPictures = ({
    userOwner,
    setUserOwner,
    myData
}: UserPicturesProps) => {
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [currentBigImage, setCurrentBigImage] = useState<UserImage | "">();

    const openInBigImage = (imageUrl: UserImage) => {
        setCurrentBigImage(imageUrl);
    };

    const closeBigImage = (event: React.MouseEvent<HTMLElement>) => {
        debugger;
        if (event.currentTarget.tagName !== "IMG" && currentBigImage) setCurrentBigImage("");
    }


    console.log(myData);
    console.log(userOwner);

    return (
        <article onClick={closeBigImage} className={style['pictures-container-wrapper']}>
            {showImageUploader && (
                <ImageUploader
                    userOwner={userOwner}
                    setUserOwner={setUserOwner}
                    setShowImageUploader={setShowImageUploader}
                />
            )}

            {myData && userOwner && myData.username == userOwner.username && (
                <button
                    onClick={() => { setShowImageUploader(!showImageUploader) }}
                    className={style['upload-image-button-shower']}
                >
                    Качете снимка
                </button>
            )}

            {/* Pictures: */}

            <article className={style['pictures-container']}>
                <h3 className={style['pictures-h3-title']}>Снимки</h3>

                <section className={style['pictures-container-section']}>
                    {userOwner && userOwner.images.length > 0 ? userOwner.images.map(pictureObj => {
                        return (
                            <>
                                <div
                                    onClick={() => openInBigImage(pictureObj as UserImage)}
                                    className={style['picture-container-wrapper']}
                                >
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imageUrl}
                                        alt={pictureObj.imageUrl}
                                        loading="lazy"
                                    />
                                </div>
                            </>
                        )
                    }) : (
                        <h3 className={style['dontHave-images-H3']}>Няма публикувани снимки</h3>
                    )}
                </section>
            </article>

            {currentBigImage && (
                <BigImage
                    imageURL={currentBigImage.imageUrl}
                    imageType={"user"}
                    setShowBigImage={() => { }}
                />
            )}
        </article>
    );
};