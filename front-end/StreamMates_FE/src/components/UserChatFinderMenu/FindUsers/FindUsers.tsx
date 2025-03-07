import { FormEvent, useEffect, useState } from "react";
import style from "./FindUsers.module.css";
import axios from "axios";
import { SearchedUser } from "../../../types/SearchedUser";

import { User } from "./User/User";
import { User as UserType } from "../../../types/User";

interface FindUsersProps {
    user: UserType;
};

export const FindUsers = ({
    user,
}: FindUsersProps) => {
    const [lastTenUsers, setLastTenUsers] = useState<SearchedUser[] | []>([]);
    const [usersByPattern, setUsersByPattern] = useState<SearchedUser[] | []>([]);


    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

    useEffect(() => {
        const getLastTenUsers = async () => {
            debugger;
            try {
                const databaseReponse = await axios.get(BASE_URL + "/getLastTenUsers", {
                    withCredentials: true,
                });
                console.log(databaseReponse.data);
                setLastTenUsers(databaseReponse.data);
            } catch (error) {
                console.log(error);
            };
        };

        getLastTenUsers();
    }, []);


    // With simillar name:
    const getUsersByPattern = async (event: FormEvent) => {
        event.preventDefault();
        const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

        const searchedUser = ((event.target as HTMLFormElement)
            .elements.namedItem("searchInput") as HTMLInputElement)
            .value;

        debugger;
        try {
            const databaseReponse = await axios.post(BASE_URL + "/getUsersByPattern", { searchedUser }, { withCredentials: true });
            console.log(databaseReponse.data);
            setUsersByPattern(databaseReponse.data);
        } catch (error) {
            console.log(error);
        };
    };


    return (
        <section className={style['find-users-container']}>
            <h3 className={style['search-h3']}>Search</h3>
            <form onSubmit={getUsersByPattern}>
                <input name="searchInput" className={style['search-input']} type="text" placeholder="Search.." />
                <button style={{ display: "none" }} aria-hidden="true"></button>
            </form>
            <span className={style['bound-line']}></span>


            {/* USERS LIST: */}
            <section className={style['users-list']}>
                {usersByPattern && lastTenUsers && (usersByPattern.length > 0 ? usersByPattern : lastTenUsers).map(currentUser => {
                    return (
                        <>
                            <User
                                key={user.firstName + user.lastName} // they are unique.
                                searchedUser={currentUser}
                                myData={user}
                            />
                        </>
                    )
                })}
            </section>
        </section>
    );
}