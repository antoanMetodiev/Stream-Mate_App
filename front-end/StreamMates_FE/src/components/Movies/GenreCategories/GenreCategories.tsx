import style from "./GenreCategories.module.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { allGenres } from "../../../utils/utils";

export const GenreCategories = () => {
    return (
        <div className={style['genre-categories-container']}>
            <Swiper
                slidesPerView={6}
                spaceBetween={20}  // Разстояние между елементите
                pagination={{ enabled: false }}
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
