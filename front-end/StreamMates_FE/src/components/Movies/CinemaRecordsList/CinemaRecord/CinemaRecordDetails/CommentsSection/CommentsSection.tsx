import { useEffect, useState } from "react";
import { User } from "../../../../../../types/User";
import { Comment } from "./Comment/Comment";
import style from "./CommentsSection.module.css";
import { WriteComment } from "./WriteComment/WriteComment";
import { Comment as CommentType } from "../../../../../../types/Comment";
import axios from "axios";
import { CommentsLoader } from "./CommentsLoader/CommentsLoader";
import { useLocation } from "react-router-dom";

interface CommentsSectionProps {
    myData: User | undefined;
    currentCinemaRecordId: string;
}

export const CommentsSection = ({
    myData,
    currentCinemaRecordId,
}: CommentsSectionProps) => {
    const location = useLocation();
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [comments, setComments] = useState<CommentType[] | []>()
    const [order, setOrder] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);

            debugger;
            const additionalUrl = location.pathname.includes("/movies/") ? "movie" : "series";
            try {
                const apiResponse = await axios.get((BASE_URL + `/get-next-10-${additionalUrl}-comments`), {
                    withCredentials: true,
                    params: { order, currentCinemaRecordId }
                });
  
                console.log(apiResponse.data);
                setIsLoading(false);
                setComments(prevComments => {
                    const newComments = prevComments ?? [];
                    return [...newComments, ...apiResponse.data];
                });
            } catch (error) {
                console.log(error);
            };
        };

        fetchComments();

    }, [order]);



    return (
        <section className={style['comments-section-container']}>
            <button
                onClick={() => { setShowCommentSection(!showCommentSection) }}
                className={style['show-comments-button']}
            >
                {!showCommentSection ? "Show Comments" : "Hide Comments"}
            </button>

            {showCommentSection && (
                <>
                    <WriteComment
                        myData={myData}
                        currentCinemaRecordId={currentCinemaRecordId}
                        setComments={setComments}
                    />

                    <div className={style['comments-list']}>
                        {comments && comments?.length > 0 ? comments?.map(comment => {
                            return (
                                <Comment
                                    key={comment.createdAt?.toString()}
                                    myData={myData}
                                    comment={comment}
                                    setComments={setComments}
                                    currentCinemaRecordId={currentCinemaRecordId}
                                />
                            )
                        }) : (
                            <h3>No Comments!</h3>
                        )}
                    </div>
                    {isLoading && <CommentsLoader />}

                    <button
                        onClick={() => { setOrder(order + 1); }}
                        className={style['load-more-comments-button']}
                    >
                        Load more
                    </button>
                </>
            )}
        </section>
    );
}