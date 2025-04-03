
import axios from "axios";
import { User } from "../../../../../../../../types/User";
import style from "./EditProfileBody.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface EditProfileBody {
    myData: User | null;
    uploadImagesHandler: () => void;
}

export const EditProfileBody = ({
    myData,
    uploadImagesHandler,
}: EditProfileBody) => {
    const navigate = useNavigate();
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
    const [messageText, setMessageText] = useState(`Моля, когато сте готови с промените - натиснете бутона "Edit Profile" за да се запазят!`);


    // Обработва изпращането на формата
    const editUserDataHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        setMessageText("Моля изчакайте..");
        event.preventDefault();

        // Събираме данните от формата
        const formData = new FormData(event.currentTarget);
        const userData = {
            id: myData?.id,
            username: formData.get("username") as string,
            fullName: formData.get("fullName") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string
        };

        if (!userData.email && !userData.username && !userData.fullName && !userData.password) {
            setMessageText("Успешно направени промени!");
            await uploadImagesHandler();
            navigate(`/user-details/${userData.username ? userData.username : myData?.username}`, {
                state: { myData }
            });
            return;
        }

        await uploadImagesHandler();
        try {
            await axios.put((BASE_URL + "/edit-profile-data"), userData, {
                withCredentials: true
            });

            setMessageText("Успешно направени промени!");
            navigate(`/user-details/${userData.username ? userData.username : myData?.username}`, {
                state: { myData }
            });

        } catch (error) {
            console.log(error);
        };
    };


    return (
        <section className={style['edit-profile-body']}>
            <h3 className={style['message-text']}>{messageText}</h3>

            <form
                onSubmit={editUserDataHandler}
                className={style['form-container']}
            >
                <section>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder={myData?.username && myData?.username.length > 0 ? "@" + myData?.username : "Type username.."}
                    />

                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder={myData?.fullName && myData?.fullName.length > 0 ? myData?.fullName : "Type full name.."}
                    />
                </section>

                <section>
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder={myData?.email && myData?.email.length > 0 ? myData?.email : "Type email.."}
                    />

                    <label>Password</label>
                    <input
                        type="text"
                        name="password"
                        placeholder={myData?.password && myData?.password.length > 0 ? myData?.password : "Type password.."}
                    />
                </section>

                <button className={style['edit-profile-button']}>Edit Profile</button>
            </form>
        </section>
    );
}