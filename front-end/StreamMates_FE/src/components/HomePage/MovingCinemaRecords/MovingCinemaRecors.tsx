import style from "./MovingCinemaRecords.module.css";
import { MovingMovies } from "./MovingMovies/MovingMovies";
import { MovingSeries } from "./MovingSeries/MovingSeries";

export const MovingCinemaRecords = () => {


    return (
        <section className={style['moving-cinema-records']}>
            <MovingMovies />
            <MovingSeries />
        </section>
    );
};
