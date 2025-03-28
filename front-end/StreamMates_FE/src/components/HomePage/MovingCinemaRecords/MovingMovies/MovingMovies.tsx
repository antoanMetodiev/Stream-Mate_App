import style from "./MovingMovies.module.css";

import { movingMovies } from "../images.ts";

export const MovingMovies = () => {


    return (
        <div className={style['movies-wrapper']}>
            <div className={style['movies-container']}>
                {movingMovies.map(movie => (
                    <div key={movie.image} className={style['movie-item']}>
                        <img src={movie.image} alt={movie.name} className={style['movie-image']} />
                        <h3 className={style['movie-name']}>{movie.name}</h3>
                    </div>
                ))}
            </div>
            <div className={style['movies-container']}>
                {movingMovies.map(movie => (
                    <div key={movie.image} className={style['movie-item']}>
                        <img src={movie.image} alt={movie.name} className={style['movie-image']} />
                        <h3 className={style['movie-name']}>{movie.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}