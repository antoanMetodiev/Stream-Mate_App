import { User } from "../../../../../../../../types/User";
import style from "./EditProfileHeader.module.css";

import deffaultBackgroundImage from "../../../../../../../../images/deffault-user-background.webp";
import deffaultUserImage from "../../../../../../images/deffault-user-image.jpg";

interface ImageState {
    file: File | null;
    url: string;
}

interface EditProfileHeaderProps {
    myData: User | null;
    backgroundImage: ImageState;
    setBackgroundImage: (value: ImageState) => void;
    userImage: ImageState;
    setUserImage: (value: ImageState) => void;
}

export const EditProfileHeader = ({
    myData,
    backgroundImage,
    setBackgroundImage,
    userImage,
    setUserImage
}: EditProfileHeaderProps) => {


    const editImage = (type: string) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            debugger;
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                console.log(`Selected file for ${type}:`, file); // Логваме файла
                console.log(`Generated URL for ${type}:`, url); // Логваме URL-а

                if (type === "BACKGROUND") {
                    setBackgroundImage({ file, url });
                } else {
                    setUserImage({ file, url });
                };
            };
        };
        input.click();
    };

    return (
        <section className={style['edit-profile-header']}>
            <span className={style['shadow']}></span>
            <img
                className={style['background-image']}
                src={backgroundImage.url || (myData?.backgroundImageURL?.length ? myData.backgroundImageURL : deffaultBackgroundImage)}
                alt="backgroundImageURL"
            />
            <button
                onClick={() => editImage("BACKGROUND")}
                className={`${style['edit-button']} ${style['background-edit-btn']}`}
            >
                Edit Background
            </button>
            <img
                className={style['user-image']}
                src={userImage.url || (myData?.profileImageURL?.length ? myData.profileImageURL : deffaultUserImage)}
                alt="User Profile"
            />
            <button
                onClick={() => editImage("USER-IMAGE")}
                className={`${style['edit-button']} ${style['user-edit-btn']}`}
            >
                Edit Image
            </button>
        </section>
    );
};
