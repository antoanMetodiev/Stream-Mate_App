import style from "./BehindElement.module.css";

export const BehindElement = () => {
    window.scrollTo(0, 0);

    return (
        <div className={style['behind-element']}></div>
    );
}