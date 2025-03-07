import { SearchedUser } from "../../../../types/SearchedUser";
import style from "./User.module.css";

import deffaultUserImage from "./../../images/deffault-user-image.jpg";
import { useNavigate } from "react-router-dom";
import { User as UserType} from "../../../../types/User";

interface UserProps {
    searchedUser: SearchedUser
    myData: UserType,
};

export const User = ({
    searchedUser,
    myData,
}: UserProps) => {
    const navigate = useNavigate();

    const showUserDetailsHandler = () => {
        navigate(`/user-details/${searchedUser.username}`, {
            state: { searchedUser, myData }
        });
    };


    return (
        <div
            onClick={showUserDetailsHandler}
            className={style['user-container']}
        >
            <img
                className={style['user-image']}
                src={searchedUser.imgURL ? searchedUser.imgURL : deffaultUserImage}
                alt={searchedUser.imgURL ? searchedUser.imgURL : deffaultUserImage}
            />
            <div className={style['meta-data-info-container']}>
                <h3 className={style['username']}>{searchedUser.username}</h3>
                <h3 className={style['names']}>{searchedUser.firstName + " " + searchedUser.lastName}</h3>
            </div>
        </div>
    );
};