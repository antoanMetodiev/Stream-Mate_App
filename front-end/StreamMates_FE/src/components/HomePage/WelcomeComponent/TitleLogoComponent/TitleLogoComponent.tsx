import style from "./TitleLogoComponent.module.css"

import siteLogo from "../../../../images/logo.jpg";

export const TitleLogoComponent = () => {
    
    return (
        <div className={style['title-logo-container-wrapper']}>
            <img
                className={style['site-logo-img']}
                src={siteLogo}
                alt="siteLogo"
            />
        </div>
    );
}