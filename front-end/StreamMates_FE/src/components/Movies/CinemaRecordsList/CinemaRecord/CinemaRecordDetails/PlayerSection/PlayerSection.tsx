import { useRef } from "react";
import style from "./PlayerSection.module.css";

interface PlayerSectionProps {
    videoURL: string
};

export const PlayerSection = ({
    videoURL
}: PlayerSectionProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    console.log(iframeRef);

    return (
        <section className={style['player-section-container']}>
            <iframe
                ref={iframeRef}
                src={videoURL}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
            ></iframe>
        </section>
    );
};