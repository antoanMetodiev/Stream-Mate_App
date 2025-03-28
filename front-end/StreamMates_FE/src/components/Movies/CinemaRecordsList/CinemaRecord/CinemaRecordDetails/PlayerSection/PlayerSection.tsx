import { useRef } from "react";
import style from "./PlayerSection.module.css";
import { useInView } from "react-intersection-observer";

interface PlayerSectionProps {
    videoURL: string | null | undefined
};

export const PlayerSection = ({
    videoURL
}: PlayerSectionProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Използваме useInView за анимация при влизане в изгледа
    const { ref, inView } = useInView({
        triggerOnce: true, // Само веднъж да се изпълнява анимацията
        threshold: 0.2,    // Трябва да се види 20% от елемента, за да се активира
    });

    return (
        <section
            ref={ref}  // Закачаме референцията
            className={`${style['player-section-container']} ${inView ? style['visible'] : ''}`}
        > 
            {videoURL && (
                <iframe
                    ref={iframeRef}
                    src={videoURL}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                ></iframe>
            )}
        </section>
    );
};