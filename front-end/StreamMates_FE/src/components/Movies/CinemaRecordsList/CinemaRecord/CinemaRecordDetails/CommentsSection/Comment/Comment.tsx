import style from "./Comment.module.css";
import { Comment as CommentType } from "../../../../../../../types/Comment";
import { User } from "../../../../../../../types/User";

import moreOptions from "./../../../../../../../images/more-options.png";
import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    // Опции за форматиране на часа без секунди
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
    };

    // Форматираме само времето
    const time = date.toLocaleString('bg-BG', timeOptions);

    // Опции за форматиране на датата
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    // Форматираме само датата
    const datePart = date.toLocaleString('bg-BG', dateOptions);

    // Връщаме форматирания резултат с първо часа и след това датата
    return `${time} ${datePart}`;
};

interface CommentProps {
    comment: CommentType;
    myData: User | undefined;
    currentCinemaRecordId: string;
    setComments: React.Dispatch<React.SetStateAction<CommentType[] | [] | undefined>>;
};

export const Comment = ({
    comment,
    myData,
    currentCinemaRecordId,
    setComments
}: CommentProps) => {
    const location = useLocation();
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://dark-sissy-stream-mate-b1e9d2a2.koyeb.app";
    
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const removeComment = async (commentId: string) => {
        debugger;
        if (commentId.trim().length == 0) return;

        const additionalUrl = location.pathname.includes("/movies/") ? "movie" : "series";
        const movieId = currentCinemaRecordId;
        try {
            await axios.delete((BASE_URL + `/delete-${additionalUrl}-comment`), {
                withCredentials: true,
                params: { commentId, movieId }
            });

            setComments(prevComments => (prevComments ?? []).filter(comment => comment.id !== commentId));
        } catch (error) {
            console.log(error);
        };
    };

    console.log(comment);
    return (
        <div className={style['comment-container']}>
            {myData && myData.id === comment.authorId && (
                <img
                    onClick={() => { setShowMoreOptions(!showMoreOptions) }}
                    className={style['more-options-img']}
                    src={moreOptions}
                    alt="moreOptions"
                />
            )}

            {showMoreOptions && (
                <section className={style['options-container']}>
                    <h4 onClick={() => { removeComment(comment.id ? comment.id : "") }}>Remove</h4>
                </section>
            )}

            <div className={style['user-info']}>
                <img className={style['user-image']} src={comment.authorImgURL} alt="User Avatar" />
                <div>
                    <h4>{"@" + comment.authorUsername}</h4>
                    <h3>{comment.authorFullName}</h3>
                </div>
            </div>
            <p className={style['comment-text']}>{comment.commentText}</p>
            <div className={style['rating-circle']}>{"Rating: " + comment.rating}</div>
            <h3 className={style['created-at']}>{comment.createdAt && formatDate(comment.createdAt?.toString())}</h3>
        </div>
    );
}