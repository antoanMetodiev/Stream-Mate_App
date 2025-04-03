import React, { useRef, useState } from "react";
import axios from "axios";

import style from "./ImageUploader.module.css";
import staticImage from "./../UserChatFinderMenu/images/no-image-found.png";
import { UserImageType } from "../../types/enums/UserImageType";
import { User } from "../../types/User";
import { useLocation } from "react-router-dom";

interface ImageUploaderProps {
    userOwner: User | null;
    setShowImageUploader: React.Dispatch<React.SetStateAction<boolean>>;
    setUserOwner: React.Dispatch<React.SetStateAction<User | null>>;
    setUserRegisterImgURL?: React.Dispatch<React.SetStateAction<string>>;
    setUserRegisterImgFile?: React.Dispatch<React.SetStateAction<File | null>>;
}

export const ImageUploader = ({
    userOwner,
    setShowImageUploader,
    setUserOwner,
    setUserRegisterImgURL,
    setUserRegisterImgFile
}: ImageUploaderProps) => {
    const location = useLocation();
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const messageTextRef = useRef<HTMLParagraphElement | null>(null);
    const writeSomethingTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) return;
        debugger;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my-preset"); // Замени с твоя `upload_preset`

        if (messageTextRef.current) {
            messageTextRef.current.textContent = "Качва се... ⏳";
        }

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dxkloyfs1/image/upload",
                formData
            );

            const uploadedImageUrl = response.data.secure_url;
            console.log(uploadedImageUrl);
            setImageUrl(uploadedImageUrl);

            if (messageTextRef.current) {
                messageTextRef.current.textContent = "Успешно качване. ✔️";
            }

            const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
            if (!userOwner) {
                return;
            }

            // Изпращане на изображението към бекенда (разкоментирай при нужда)
            await axios.post((BASE_URL + "/save-user-picture"), {
                userImageType: UserImageType.PLAIN,
                description: writeSomethingTextAreaRef.current?.value || "",
                imageUrl: uploadedImageUrl,
                ownerId: userOwner.id,
            }, { withCredentials: true });

            const newUserOwnerData = { ...userOwner };
            newUserOwnerData.images.unshift(
                {
                    description: writeSomethingTextAreaRef.current?.value || "",
                    imageUrl: uploadedImageUrl,
                    ownerId: userOwner.id,
                }
            );

            setUserOwner(newUserOwnerData);

        } catch (error) {
            console.error("Error uploading the image to Cloudinary:", error);
            if (messageTextRef.current) {
                messageTextRef.current.textContent = "Грешка при качване. ❌";
            }; 0
        };
    };

    const changeImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (messageTextRef.current) {
                        messageTextRef.current.textContent = "Избрахте снимка...";
                    }
                    setImageUrl(e.target?.result as string);
                    setFile(file);

                    if (setUserRegisterImgURL && setUserRegisterImgFile) {
                        setUserRegisterImgURL(e.target?.result as string);
                        setUserRegisterImgFile(file);
                    }
                };
                reader.readAsDataURL(file);
            };
        };
    };

    return (
        <article>
            <div className={style[!location.pathname.includes("/register") ? "image-upload-container-wrapper" : "isForUserProp"]}>
                
                {!location.pathname.includes("/register") && (
                    <>
                        <div
                            onClick={() => setShowImageUploader(false)}
                            className={style['close-button']}>
                            X
                        </div>
                        <button className={style["upload-image-button"]} onClick={handleSubmit}>
                            Качване.. 🌐
                        </button>
                        <h5 className={style["messageText-h5"]} ref={messageTextRef}></h5>
                        <img
                            className={style["image-for-upload"]}
                            src={imageUrl && imageUrl.length > 0 ? imageUrl : staticImage}
                            alt="uploaded"
                        />
                    </>
                )}

                <>
                    {location.pathname.includes("register") && (
                        <label className={style['upload-image-label']} htmlFor="file-input">Upload Image</label>
                    )}
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        className={style[!location.pathname.includes("/register") ? "uploadImage-input" : "uploadProfileImage-input"]}
                        onChange={changeImageHandler}
                    />
                </>
            </div>
        </article>
    );
};
