import style from "./TitleLogoComponent.module.css"

import siteLogo from "../../../../images/logo.jpg";
import { useNavigate } from "react-router-dom";

export const TitleLogoComponent = () => {
    const navigate = useNavigate();

    return (
        <div className={style['title-logo-container-wrapper']}>
            <img
                onClick={() => navigate("/")}
                className={style['site-logo-img']}
                src={siteLogo}
                alt="siteLogo"
            />
        </div>
    );
}