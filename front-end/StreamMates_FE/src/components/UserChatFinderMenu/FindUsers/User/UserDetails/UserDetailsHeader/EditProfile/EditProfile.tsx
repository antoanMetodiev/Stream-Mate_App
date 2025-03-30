import { useLocation } from "react-router-dom";
import style from "./EditProfile.module.css";
import { useState } from "react";
import { User } from "../../../../../../../types/User";
import { EditProfileHeader } from "./EditProfileHeader/EditProfileHeader";
import { EditProfileBody } from "./EditProfileBody/EditProfileBody";
import axios from "axios";

export const EditProfile = () => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://dark-sissy-stream-mate-b1e9d2a2.koyeb.app";
    const location = useLocation();
    const [myData, setMyData] = useState<User | null>(location.state?.myData || null);
    const [backgroundImage, setBackgroundImage] = useState<{ file: File | null; url: string }>({
        file: null,
        url: "",
    });
    const [userImage, setUserImage] = useState<{ file: File | null; url: string }>({
        file: null,
        url: "",
    });


    const uploadImagesHandler = async () => {
        if (!backgroundImage.file && !userImage.file) return;
    
        // Функция за качване на едно изображение в Cloudinary
        const uploadToCloudinary = async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my-preset"); // Замени с твоя `upload_preset`
    
            try {
                const response = await axios.post("https://api.cloudinary.com/v1_1/dxkloyfs1/image/upload", formData);
                return response.data.secure_url; // Връща URL на каченото изображение
            } catch (error) {
                console.error("Upload failed:", error);
                return undefined; // Връща undefined, ако качването не е успешно
            };
        };
    
        debugger;
        let backgroundUrl: string | undefined = undefined;
        let userUrl: string | undefined = undefined;
    
        // Качваме изображенията последователно
        if (backgroundImage.file) {
            backgroundUrl = await uploadToCloudinary(backgroundImage.file);
            console.log("Uploaded Background URL:", backgroundUrl);
        }
    
        if (userImage.file) {
            userUrl = await uploadToCloudinary(userImage.file);
            console.log("Uploaded User Image URL:", userUrl);
        }
    
        // Ако нито едно изображение не е качено, спираме функцията
        if (!backgroundUrl && !userUrl) return;
    
        try {
            const userId = myData?.id;
            
            // Ако и двете изображения са качени, изпращаме новите URL адреси към сървъра
            await axios.put(`${BASE_URL}/change-user-main-photos`, { userId, backgroundUrl, userUrl }, {
                withCredentials: true,
            });
    
            // Проверяваме дали myData има валидно id, преди да актуализираме
            if (!myData) {
                console.error("User ID is missing");
                return;
            }
    
            // Подаваме новите данни в setMyData
            setMyData({
                ...myData, // Запазваме старите данни
                backgroundImageURL: backgroundUrl, // Актуализираме само backgroundImageURL
                profileImageURL: userUrl // Актуализираме profileImageURL
            });
    
        } catch (error) {
            console.log(error);
        };
    };


    return (
        <section className={style['edit-profile-container']}>
            <EditProfileHeader
                myData={myData}
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
                userImage={userImage}
                setUserImage={setUserImage}
            />

            <EditProfileBody myData={myData} uploadImagesHandler={uploadImagesHandler} />
        </section>
    );
}