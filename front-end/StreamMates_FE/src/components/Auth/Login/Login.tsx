import styles from "./Login.module.css";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { LoginUser } from "../../../types/dtos/LoginUser";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";

import back from "../../../images/fv.webp";

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const Login = ({
    setUser,
}: LoginProps) => {
    const navigate = useNavigate();
    const [invalidDataMessage, setInvalidDataMessage] = useState("");

    async function loginUser(event: FormEvent) {
        event.preventDefault();
        const formData = event.target as HTMLFormElement;
        const username = (formData.elements.namedItem("username") as HTMLInputElement).value;
        const password = (formData.elements.namedItem("password") as HTMLInputElement).value;

        const user: LoginUser = { username, password }
        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";

        try {
            const apiResponse = await axios.post(BASE_URL + "/login", user, {
                withCredentials: true
            });
            console.log(apiResponse.data);

            const responseUser: User = apiResponse.data;
            setUser(responseUser);
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                setInvalidDataMessage(error.response?.data.toString()); // Използваме точния текст или структура на грешката
            };
        };
    };

    return (
        <article className={styles['login-container-wrapper']}>
            <form
                onSubmit={loginUser}
                className={`${styles["register"]} ${styles["other"]}`}
            >
                <header className={styles["header"]}>
                    <h1>Sign In</h1>
                </header>
                <fieldset>
                    <legend>Username &amp; Password:</legend>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-username"]}`}
                    >
                        <label htmlFor="username">Username: </label>
                        <input
                            name="username"
                            type="text"
                            id="username"
                            placeholder="Username..."
                        />
                        <i className="fa fa-user" />

                        <span className={styles["helper"]}>Hello there</span>
                    </div>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-password"]}`}
                    >
                        <input
                            name="password"
                            type="password"
                            id="re-password"
                            placeholder="Password..."
                        />
                        <label htmlFor="re-password">Password:</label>
                        <i className="fa fa-key" />
                    </div>
                </fieldset>

                <span
                    // onClick={onClickSignUpHandler}
                    className={styles["sign-up-option"]}
                >
                    Sign Up
                </span>
                <input type="submit" value="Sign In" />
            </form>


            <span className={styles['shadow']}></span>
            <img
                className={styles["background-img"]}
                src={back} alt="back"
            />

            {invalidDataMessage.length && <h3 className={styles["invalid-data-message"]}>{invalidDataMessage}</h3>}
        </article>
    );
};