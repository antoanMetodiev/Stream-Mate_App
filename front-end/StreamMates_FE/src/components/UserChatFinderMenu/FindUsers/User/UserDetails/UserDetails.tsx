import style from "./UserDetails.module.css";

import { UserDetailsHeader } from "./UserDetailsHeader/UserDetailsHeader";
import { UserDetailsBody } from "./UserDetailsBody/UserDetailsBody";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../../../../types/User";

export const UserDetails = () => {
    const location = useLocation();

    // States:
    const [searchedUser, setSearchedUser] = useState<User | null>(null);
    const [myData, setMyData] = useState<User | null>(location.state?.myData ? location.state?.myData : null);
    const [showPictures, setShowPictures] = useState(true);

    useEffect(() => {
        if (myData && searchedUser && myData?.id === searchedUser?.id) {
            setMyData(searchedUser);
        }
    }, [searchedUser]);
   
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://dark-sissy-stream-mate-b1e9d2a2.koyeb.app";
    useEffect(() => {
        const getSearchedUserData = async () => {
            debugger;
            const count: number = window.location.href.split("/").length;
            const username = window.location.href.split("/")[count - 1];
            console.log(username);

            try {
                const databaseResponse = await axios.post(BASE_URL + "/get-user-details", { username }, { withCredentials: true });
                console.log(databaseResponse.data);
                setSearchedUser(databaseResponse.data);

            } catch (error) {
                console.log(error);
            };
        };

        getSearchedUserData();
    }, [location.pathname]);


    return (
        <div className={style['user-details-wrapper']}>
            {searchedUser && (
                <>
                    <UserDetailsHeader
                        searchedUser={searchedUser}
                        myData={myData}
                        setMyData={setMyData}
                        showPictures={showPictures}
                        setShowPictures={setShowPictures}
                    />
                    <UserDetailsBody
                        searchedUser={searchedUser}
                        setSearchedUser={setSearchedUser}
                        myData={myData}
                        showPictures={showPictures}
                    />
                </>
            )}
        </div>
    );
};