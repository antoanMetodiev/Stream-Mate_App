import style from "./UserDetails.module.css";

import { UserDetailsHeader } from "./UserDetailsHeader/UserDetailsHeader";
import { UserDetailsBody } from "./UserDetailsBody/UserDetailsBody";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SearchedUser } from "../../../../../types/SearchedUser";
import { User } from "../../../../../types/User";

export const UserDetails = () => {
    const location = useLocation();
    const beginSearchedUserData: SearchedUser = location.state.searchedUser || {};

    // States:
    const [searchedUser, setSearchedUser] = useState<User | null>(null);
    const [myData, setMyData] = useState(location.state.myData || {});
    const [showPictures, setShowPictures] = useState(true);


    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
    useEffect(() => {

        const getSearchedUserData = async () => {
            const username = beginSearchedUserData.username;

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
                        myData={myData}
                        showPictures={showPictures}
                    />
                </>
            )}
        </div>
    );
};