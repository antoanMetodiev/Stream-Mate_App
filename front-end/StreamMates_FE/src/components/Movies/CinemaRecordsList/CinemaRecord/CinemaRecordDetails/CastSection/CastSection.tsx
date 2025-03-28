import { Movie } from "../../../../../../types/MovieType";
import { Series } from "../../../../../../types/Series";
import style from "./CastSection.module.css";
import { Actor } from "./Actor/Actor";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css"; // Задължителен CSS за стилизиране на слайдера
import { ActorType } from "../../../../../../types/ActorType";
import { useNavigate } from "react-router-dom";

import { useInView } from 'react-intersection-observer';

interface CastSectionProps {
    cinemaRecord: (Movie | Series) | undefined;
}

export const CastSection = ({
    cinemaRecord
}: CastSectionProps) => {
    const navigate = useNavigate();
    const [sliderRef] = useKeenSlider({
        mode: "snap", // Плавно движение
        slides: {
            perView: 8, // ✅ Това трябва да бъде тук
            spacing: 12, // ✅ Това също
        },
        breakpoints: {
            "(max-width: 1024px)": { slides: { perView: 3, spacing: 6 } },
            "(max-width: 768px)": { slides: { perView: 2, spacing: 6 } },
            "(max-width: 480px)": { slides: { perView: 1, spacing: 4 } },
        }
    });

    const navigateToActorDetails = (actor: ActorType, backgroundImg_URL: string) => {
        navigate("/actors/" + actor.id, {
            state: { actor, backgroundImg_URL } // Изпращаш целия обект actor в state
        });
    };

    const { ref, inView } = useInView({
        triggerOnce: true, // За да се активира само веднъж
        threshold: 0.5, // Колко от елемента трябва да бъде видимо
    });


    return (
        <section
            ref={ref}
            className={`${style['cast-section-container']} ${inView ? style['visible'] : ''}`}
        >
            <h3 className={style['top-cast-h3']}>TOP CAST</h3>

            <div>
                <div ref={sliderRef} className="keen-slider">
                    {cinemaRecord?.castList.map((actor) => (
                        <div
                            onClick={() => navigateToActorDetails(actor, cinemaRecord?.backgroundImg_URL)}
                            key={actor.id}
                            className="keen-slider__slide"
                        >
                            <Actor actor={actor} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};