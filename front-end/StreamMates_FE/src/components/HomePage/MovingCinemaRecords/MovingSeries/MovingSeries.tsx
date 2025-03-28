import style from "./MovingSeries.module.css";

import { movingSeries } from "../images";

export const MovingSeries = () => {

    return (
        < div className={style['series-wrapper']} >
            <div className={style['series-container']}>
                {movingSeries.map(series => (
                    <div key={series.image} className={style['movie-item']}>
                        <img src={series.image} alt={series.name} className={style['movie-image']} />
                        <h3 className={style['movie-name']}>{series.name}</h3>
                    </div>
                ))}
            </div>
            <div className={style['series-container']}>
                {movingSeries.map(series => (
                    <div key={series.image} className={style['movie-item']}>
                        <img src={series.image} alt={series.name} className={style['movie-image']} />
                        <h3 className={style['movie-name']}>{series.name}</h3>
                    </div>
                ))}
            </div>
        </div >
    )
}