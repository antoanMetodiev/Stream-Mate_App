import styles from "./Register.module.css";

import backgroundVideo from "./../../../videos/mystery-shack.mp4";
import { FormEvent } from "react";
import axios from "axios";
import { RegisterUser } from "../../../types/dtos/RegisterUser";

export const Register = () => {

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    };


    async function registerUser(event: FormEvent) {
        event.preventDefault();
        const formData = event.target as HTMLFormElement;

        const username = (formData.elements[1] as HTMLInputElement).value;
        const email = (formData.elements.namedItem('email') as HTMLInputElement).value;
        const firstName = (formData.elements.namedItem('first_name') as HTMLInputElement).value;
        const lastName = (formData.elements.namedItem('last_name') as HTMLInputElement).value;
        const password = (formData.elements.namedItem('password') as HTMLInputElement).value;

        const user: RegisterUser = { username, email, firstName, lastName, password }
        if (validateEmail(user.email)) {
            console.log('Email is valid');
        } else {
            console.log('Email is invalid');
        }
        debugger;

        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

        try {
            const apiResponse = await axios.post(BASE_URL + '/register', user, {
                withCredentials: true
            });
            console.log(apiResponse.data);

        } catch (error) {
            console.log(error);
        }
    };



    return (
        <article className={styles['register-container-wrapper']}>

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
                        />
                        <label htmlFor="email">Email: </label>
                        <i className="fa fa-envelope" />
                    </div>
                </fieldset>

                <fieldset>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-username"]}`}
                    >
                        <label htmlFor="username">First Name: </label>
                        <input
                            name="first_name"
                            type="text"
                            id="username"
                        />
                        <i className="fa fa-user" />

                    </div>
                    <div
                        className={`${styles["field"]} ${styles["text"]} ${styles["icon-username"]}`}
                    >
                        <label htmlFor="username">Last Name: </label>
                        <input
                            name="last_name"
                            type="text"
                            id="username"
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
                        />

                        <i className="fa fa-key" />
                    </div>
                </fieldset>

                <input type="submit" value="Sign Up" />

                {/* {error && <p className={styles["error"]}>{error}</p>} */}


                {/* Contains Or Not Username Text: */}
                {/* <h2
                    className={styles['register-or-not-text']}
                >{registerOrNotText}</h2> */}

            </form>

        </article>
    );
};