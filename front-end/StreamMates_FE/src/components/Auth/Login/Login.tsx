import styles from "./Login.module.css";

import backgroundVideo from "./../../../videos/mystery-shack.mp4";
import { FormEvent } from "react";
import axios from "axios";
import { LoginUser } from "../../../types/dtos/LoginUser";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const Login = ({
    setUser,
}: LoginProps) => {
    const navigate = useNavigate();

    async function loginUser(event: FormEvent) {
        event.preventDefault();
        const formData = event.target as HTMLFormElement;
        const username = (formData.elements.namedItem("username") as HTMLInputElement).value;
        const password = (formData.elements.namedItem("password") as HTMLInputElement).value;

        const user: LoginUser = { username, password }

        debugger;
        try {
            const apiResponse = await axios.post("http://localhost:8080/login", user, {
                withCredentials: true
            });
            console.log(apiResponse.data);

            const responseUser: User = apiResponse.data;
            setUser(responseUser);
            navigate("/");

        } catch (error) {
            console.log(error);
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
            <video
                className={styles['background-video']}
                src={backgroundVideo}
                autoPlay
                loop
                muted
                playsInline
            >
            </video>
        </article>
    );
};