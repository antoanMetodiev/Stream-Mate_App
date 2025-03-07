import { User } from "../../../../../../../types/User";
import style from "./UserPictures.module.css";

import { ImageUploader } from "../../../../../../ImageUploader/ImageUploader";
import { useState } from "react";

interface UserPicturesProps {
    userOwner: User;
    myData: User;
};

export const UserPictures = ({
    userOwner,
    myData
}: UserPicturesProps) => {
    const [showImageUploader, setShowImageUploader] = useState(false);


    console.log(myData);
    console.log(userOwner);

    return (
        <article className={style['pictures-container-wrapper']}>
            {showImageUploader && <ImageUploader userOwner={userOwner} setShowImageUploader={setShowImageUploader} />}

            {myData.username == userOwner.username && (
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
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />
                                </div>

                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>

                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>

                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.image_url}
                                        alt={pictureObj.image_url}
                                    />

                                </div>

                            </>
                        )
                    }) : (
                        <h3 className={style['dontHave-images-H3']}>Няма публикувани снимки</h3>
                    )}


                </section>
            </article>
        </article>
    );
};