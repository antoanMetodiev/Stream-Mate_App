import style from "./WriteComment.module.css";
import { useRef, useState } from "react";
import { User } from "../../../../../../../types/User";
import axios from "axios";
import { Comment } from "../../../../../../../types/Comment";
import { CommentsLoader } from "../CommentsLoader/CommentsLoader";

interface WriteCommentProps {
    myData: User | undefined;
    currentCinemaRecordId: string;
    setComments: React.Dispatch<React.SetStateAction<Comment[] | [] | undefined>>;
}

export const WriteComment = ({
    myData,
    currentCinemaRecordId,
    setComments
}: WriteCommentProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
    const [rating, setRating] = useState<number>(5);
    const [isCommentFetch, setIsCommentFetch] = useState(false);

    // Refs:
    const commentText = useRef<HTMLTextAreaElement | null>(null);

    const postCommentHandler = async () => {
        setIsCommentFetch(true);
        const commentValue = commentText.current?.value.trim();
        if (!commentValue || commentValue.length === 0) return; // Поправен if, преди проверката за myData
        if (!myData) return;

        const comment: Comment = {
            authorFullName: myData.fullName,
            authorUsername: myData.username,
            authorImgURL: myData.profileImageURL ? myData.profileImageURL : "",
            authorId: myData.id,
            commentText: commentValue,
            rating: rating,
            cinemaRecordId: currentCinemaRecordId,
            createdAt: new Date().toISOString() // Добавен текущ timestamp
        };

        const additionalUrl = location.pathname.includes("/movies/") ? "movie" : "series";
        try {
            await axios.post(BASE_URL + `/post-${additionalUrl}-comment`, comment, {
                withCredentials: true,
            });

            setIsCommentFetch(false);
            setComments((prev) => [comment, ...(prev ?? [])]);

            if (commentText.current) {
                commentText.current.value = "";
            }

        } catch (error) {
            console.log(error);
        };
    };

    return (
        <>
            <section className={style['write-comment-container']}>
                <div className={style['user-information-container']}>
                    <img
                        className={style['user-image']}
                        src={myData?.profileImageURL}
                        alt="User Avatar"
                    />
                    <div className={style['user-info']}>
                        <h4>{"@" + myData?.username}</h4>
                        <h3>{myData?.fullName}</h3>
                    </div>
                </div>

                <textarea
                    ref={commentText}
                    className={style['comment-text']}
                    placeholder="Write a comment.."
                >

                </textarea>
                {/* Вертикален рейтинг */}
                <div className={style['rating-container']}>
                    <div className={style['rating-circle']}>{rating.toFixed(1)}</div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className={style['rating-slider']}
                    />
                </div>

                <button
                    onClick={postCommentHandler}
                    className={style['submit-button']}>
                    Post
                </button>
            </section>

            {isCommentFetch && <CommentsLoader />}
        </>
    );
}