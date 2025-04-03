import styles from "./Register.module.css";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { RegisterUser } from "../../../types/dtos/RegisterUser";
import { ImageUploader } from "../../ImageUploader/ImageUploader";

import deffaultUserImg from "./../../UserChatFinderMenu/images/deffault-user-image.jpg";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";

import back from "./../../../images/fv.webp";

interface RegisterProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const Register = ({
    setUser,
}: RegisterProps) => {
    const navigate = useNavigate();
    const [invalidDataMessage, setInvalidDataMessage] = useState("");
    const [choosedImgFile, setChoosedImgFile] = useState<File | null>(null);
    const [choosedImgUrl, setChoosedImgUrl] = useState("");


    async function registerUser(event: FormEvent) {
        event.preventDefault();
        const formData = event.target as HTMLFormElement;

        const username = (formData.elements[1] as HTMLInputElement).value;
        const email = (formData.elements.namedItem('email') as HTMLInputElement).value;
        const fullName = (formData.elements.namedItem('full_name') as HTMLInputElement).value;
        const password = (formData.elements.namedItem('password') as HTMLInputElement).value;
        let profileImageURL = "";

        try {
            if (choosedImgFile) {
                const profileImageData = new FormData();
                profileImageData.append("file", choosedImgFile);
                profileImageData.append("upload_preset", "my-preset"); // Замени с твоя `upload_preset`

                const response = await axios.post("https://api.cloudinary.com/v1_1/dxkloyfs1/image/upload", profileImageData);
                profileImageURL = response.data.secure_url;
                console.log(profileImageURL);
            }

        } catch (error) {
            setInvalidDataMessage("Не успяхме да запазим профилната снимка!");
        };

        debugger;
        const user: RegisterUser = { username, email, fullName, password, profileImageURL }

        const validatorResponse = validateUserInput(user);
        if (validatorResponse !== "Всичко е наред!") {
            setInvalidDataMessage(validatorResponse);
            return;
        }

        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
        try {
            const apiResponse = await axios.post(BASE_URL + '/register', user, {
                withCredentials: true
            });

            console.log(apiResponse.data);
            setUser(apiResponse.data);
            setInvalidDataMessage("Успешна Регистрация!");
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                setInvalidDataMessage(error.response?.data.toString()); // Използваме точния текст или структура на грешката
            };
        };
    };


    return (
        <article className={styles['register-container-wrapper']}>

            <span className={styles['shadow']}></span>
            <img
                className={styles['background-img']}
                src={back}
                alt="back"
            />

            <form
                onSubmit={registerUser}
                className={styles["register"]}
            >
                <header className={styles["header"]}>
                    <h1>Sign Up</h1>
                </header>
                <fieldset>
                    <legend>Username &amp; Email:</legend>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-username"]}`}
                    >
                        <label htmlFor="username">Username: </label>
                        <input
                            name="username"
                            type="text"
                            id="username"
                            placeholder="Username.."
                        />
                        <i className="fa fa-user" />

                        <span className={styles["helper"]}>Hello there</span>
                    </div>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-email"]}`}
                    >
                        <input
                            name="email"
                            type="email"
                            id="email"
                            placeholder="Email.."
                        />
                        <label htmlFor="email">Email: </label>
                        <i className="fa fa-envelope" />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Full Name &amp; Password:</legend>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-username"]}`}
                    >
                        <label htmlFor="username">Full Name: </label>
                        <input
                            name="full_name"
                            type="text"
                            id="username"
                            placeholder="Full Name.."
                        />
                        <i className="fa fa-user" />

                    </div>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-password"]}`}
                    >
                        <label htmlFor="password">Password:</label>
                        <input
                            name="password"
                            type="password"
                            id="password"
                            placeholder="Password.."
                        />

                        <i className="fa fa-key" />
                    </div>
                </fieldset>

                <input type="submit" value="Sign Up" />
            </form>

            <section className={styles['user-register-profileimg-container']}>
                <img
                    className={styles['profile-img']}
                    src={choosedImgUrl.length == 0 ? deffaultUserImg : choosedImgUrl}
                    alt="choosedImgUrl"
                />
                <ImageUploader
                    setUserRegisterImgFile={setChoosedImgFile}
                    setUserRegisterImgURL={setChoosedImgUrl}
                    userOwner={null}
                    setUserOwner={() => { }}
                    setShowImageUploader={() => { }}
                />
            </section>

            {invalidDataMessage.length && <h3 className={styles["invalid-data-message"]}>{invalidDataMessage}</h3>}
        </article>
    );
};


function validateUserInput(userInputData: RegisterUser): string {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userInputData.email || !emailRegex.test(userInputData.email)) {
        return "Невалиден email адрес.";
    }

    // Валидация на username (6-20 символа, само букви, цифри и по избор долна черта)
    const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/;
    if (!userInputData.username || !usernameRegex.test(userInputData.username)) {
        return "Потребителското име трябва да е между 6 и 20 символа и да съдържа само букви, цифри и по избор долна черта.";
    }

    // Валидация на парола (минимум 5 символа, без допълнителни изисквания)
    if (!userInputData.password || userInputData.password.length < 5) {
        return "Паролата трябва да бъде поне 5 символа.";
    }

    const fullNameRegex = /^[A-Za-zА-Яа-я\s]+$/;
    if (!userInputData.fullName || !fullNameRegex.test(userInputData.fullName)) {
        return "Името може да съдържа само букви и интервали.";
    }

    return "Всичко е наред!"
};