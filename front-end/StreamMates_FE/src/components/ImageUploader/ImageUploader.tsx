import React, { useRef, useState } from "react";
import axios from "axios";


import style from "./ImageUploader.module.css";
import staticImage from "./../UserChatFinderMenu/images/no-image-found.png";
import { UserImage } from "../../types/UserImage";
import { UserImageType } from "../../types/enums/UserImageType";
import { User } from "../../types/User";

interface ImageUploaderProps {
    userOwner: User;
    setShowImageUploader: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ImageUploader = ({
    userOwner,
    setShowImageUploader,
}: ImageUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const messageTextRef = useRef<HTMLParagraphElement | null>(null);
    const writeSomethingTextAreaRef = useRef<HTMLTextAreaElement | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        };
    };

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

            const BASE_URL = window.location.href.includes("local")
                ? "http://localhost:8080"
                : "https://streammate-org.onrender.com";

            const imgForSave: UserImage = {
                userImageType: UserImageType.PLAIN,
                description: writeSomethingTextAreaRef.current?.value || "",
                imageUrl: uploadedImageUrl,
                owner: userOwner,
            };

            console.log(imgForSave);

            // Изпращане на изображението към бекенда (разкоментирай при нужда)
            await axios.post(BASE_URL + "/save-user-picture", imgForSave, { withCredentials: true });

        } catch (error) {
            console.error("Error uploading the image to Cloudinary:", error);
            if (messageTextRef.current) {
                messageTextRef.current.textContent = "Грешка при качване. ❌";
            };
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
                };
                reader.readAsDataURL(file);
            };
        };
    };

    return (
        <article>
            <div className={style["image-upload-container-wrapper"]}>
                <div
                    onClick={() => setShowImageUploader(false)}
                    className={style['close-button']}>
                    X
                </div>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className={style["uploadImage-input"]}
                    onChange={changeImageHandler}
                />

                <textarea
                    ref={writeSomethingTextAreaRef}
                    placeholder="Напишете нещо..."
                    className={style["write-something-textArea"]}
                    id="write-something"
                />

                <button className={style["upload-image-button"]} onClick={handleSubmit}>
                    Качване.. 🌐
                </button>

                <h5 className={style["messageText-h5"]} ref={messageTextRef}></h5>
            </div>

            <img
                className={style["image-for-upload"]}
                src={imageUrl && imageUrl.length > 0 ? imageUrl : staticImage}
                alt="uploaded"
            />
        </article>
    );
};
