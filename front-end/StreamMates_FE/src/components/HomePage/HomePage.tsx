import style from "./HomePage.module.css";

import { WelcomeComponent } from "../HomePage/WelcomeComponent/WelcomeComponent";
import { User } from "../../types/User";

interface HomePageProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const HomePage = ({
    user,
    setUser,
}: HomePageProps) => {




    return (
        <article className={style['home-page-container']}>
            <WelcomeComponent user={user} setUser={setUser} />
        </article>
    );
}