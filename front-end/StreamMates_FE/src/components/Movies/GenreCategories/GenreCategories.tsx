import style from "./GenreCategories.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

import { allGenres } from "../../../utils/utils";
// import { Movie } from "../../../types/MovieType";
// import { Series } from "../../../types/Series";

// interface GenreCategoriesProps {
//     setCinemaRecordsList: React.Dispatch<React.SetStateAction<Movie[] | Series[] | undefined>>;
// };

export const GenreCategories = () => {




    return (
        <div className={style['genre-categories-container']}>
            <Swiper
                slidesPerView={6}
                spaceBetween={-400} // <== Тук намаляваш разстоянието между елементите до 0
                pagination={{ enabled: false }}
                // navigation={true}
                modules={[Pagination, Navigation]}
                className={style['mySwiper']}
            >
                {allGenres.map((genre, index) => (
                    <SwiperSlide key={index}>
                        <h3 className={style['genre-card']}>{genre}</h3>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};