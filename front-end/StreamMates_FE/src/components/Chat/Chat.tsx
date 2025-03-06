import { FormEvent, useEffect, useRef, useState } from "react";
import style from "./Chat.module.css";

import audioCallingImg from "../../images/audio-call.png";
import videoCallImg from "../../images/video_call.png";
import deffaultBackground from "../../images/deffault-chat-component-img.jpg";

import { User } from "../../types/User";
import { Message } from "../../types/Message";
import { VideoCall } from "./VideoCall/VideoCall";

import { v4 as uuidv4 } from "uuid"; // За генериране на уникално callId
import { CallNotification } from "../../types/CallNotification";
import { MessageType } from "../../types/enums/MessageType";

interface ChatProps {
    user: User | null;
};

export const Chat = ({
    user,
}: ChatProps) => {
    const [openCallSection, setOpenCallSection] = useState(false);
    const [incomingCall, setIncomingCall] = useState<CallNotification | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const textMessageRef = useRef<HTMLInputElement | null>(null);
    const receiverRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        if (!user) return;
        const username = user.username;

        const BASE_URL = window.location.href.includes("local") ? "ws://localhost:8080" : "wss://streammate-org.onrender.com";
        const ws = new WebSocket(BASE_URL + `/chat?username=${username}`);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
        };
        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onmessage = (event) => {
            console.log("Received message:", event.data);
            const callNotification: CallNotification = JSON.parse(event.data);

            // Ако получим видео обаждане от друг потребител
            if (callNotification.callType === "VIDEO_CALL" && callNotification.caller !== user.username) {
                console.log("Incoming video call from", callNotification.caller);
                setIncomingCall(callNotification);
            }
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [user]);

    // Изпращане на текстови съобщения (ако има чат функционалност)
    const sendTextOrImageMessage = (event: FormEvent) => {
        debugger;
        event.preventDefault();
        if (!socket || !textMessageRef.current || !user || !receiverRef.current) return;

        const message: Message = {
            messageText: textMessageRef.current.value,
            owner: user.username,
            receiver: receiverRef.current.textContent || "",
            messageType: MessageType.TEXT,
        };

        socket.send(JSON.stringify(message));
    };

    // Тази функция се извиква, когато ти (caller) щракнеш на иконката за видео обаждане.
    const openCallSectionHandler = (receivedCallType: string) => {
        // Отваряме Call Секцията:
        if (!openCallSection) {
            const videoCallNotification: CallNotification = {
                caller: user!.username,
                receiver: receiverRef.current?.textContent || "",
                callId: uuidv4(),
                callType: receivedCallType,
                channelName: `call_${user!.username}_${receiverRef.current?.textContent}`,
                timestamp: new Date().toISOString()
            };

            // Записваме данните, за да ги подадем на VideoCall компонента
            setIncomingCall(videoCallNotification);
            // Изпращаме известие към сървъра
            if (socket) {
                socket.send(JSON.stringify(videoCallNotification));
                console.log("Sent video call request:", videoCallNotification);
            }
        }
        // Отваряме VideoCall компонента – caller веднага влиза в обаждането и чака другия участник
        setOpenCallSection(true);
    };



    return (
        <div>
            {incomingCall && incomingCall.caller !== user?.username && (
                <div>
                    <h3 className={style['incoming-call-h3-notification']}>Входящо обаждане от: {incomingCall.caller}</h3>
                    <button>Откажи</button>
                    <button onClick={() => setOpenCallSection(true)}>Приеми</button>
                </div>
            )}

            {openCallSection && <VideoCall incomingCall={incomingCall} />}


            <article
                // ref={mainContainerWrapper}
                className={style["chat-container-wrapper"]}
            >

                <div
                    // ref={hiddenAllBackgroundVideosDivRef}
                    className={style['all-background-videos-container']}>
                    {/* <img onClick={changeWallperHandler} src={image1} alt="0" /> */}
                    {/* <img onClick={changeWallperHandler} src={image3} alt="1" /> */}
                    {/* <img onClick={changeWallperHandler} src={image3} alt="" /> */}
                </div>

                <header className={style["username-and-avatar"]}>
                    <img
                        className={style["current-friend-img"]}
                        // src={allAvatarsReversed[currentFriendData.photoURL]}
                        alt="avatar-photo"
                    />
                    <h2
                        ref={receiverRef}
                        className={style["username-title"]}
                    >
                        {user && user.username == "manuelMetodiev" ? "antoanMetodiev" : "manuelMetodiev"}
                    </h2>
                    <p className={style["online-label"]}>online</p>
                    <img
                        className={style["online-image"]}
                        // src={onlineImage}
                        alt="online-image"
                    />


                    <p
                        // ref={pillarRef}
                        className={style['pillar']}>
                    </p>

                    <i
                        // onClick={showChatOptionsHandler}
                        id={style['options']}
                        className="fa-solid fa-gear"
                    />


                    <div
                        // ref={optionsDivContainerRef}
                        className={style['options-div-container']}
                    >
                        {/* <h4 onClick={showOtherBackgroundVideosHandler}>Change background</h4> */}
                        {/* <h4 ref={blockOrNotRef} onClick={blockOrUnblockUserHandler}>Block</h4> */}
                        {/* <h4 onClick={deleteMessagesHandler}>Delete Messages</h4> */}
                    </div>

                    <img
                        onClick={() => { openCallSectionHandler("AUDIO_CALL") }}
                        className={style['audio-call-img']}
                        src={audioCallingImg}
                        alt="audioCallingImg"
                    />

                    <img
                        onClick={() => { openCallSectionHandler("VIDEO_CALL") }}
                        className={style["video-call-img"]}
                        src={videoCallImg}
                        alt="videoCallImg"
                    />
                </header>


                {/* Blocked User: */}

                <div
                    // ref={youAreBlockedContainerRef}
                    className={style['blocked-user-container']}>
                    <h2>Blocked User!</h2>
                </div>


                <section
                    // ref={messagesContainerRef}
                    className={style["messages-section"]}
                >

                    <p className={style['shadow']}></p>

                    <img
                        className={style['message-section-wallper-img']}
                        src={deffaultBackground}
                        alt="deffaultBackground"
                    />

                    {/* {allMessagesForCurrentConversation.map((msg) => (
                        isValidImageUrl(msg.text) ? (
                            msg.userName === currentUserUsername ? (

                                <div className={style['img-message-wrapper-container']}>
                                    <img
                                        onClick={showBigImageHandler}
                                        // onMouseEnter={() => setIsHovered(true)}
                                        // onMouseLeave={() => setIsHovered(false)}
                                        value={msg.text} className={style['my-img-message']}
                                        src={msg.text} alt="my-img-message" key={msg.id}
                                    />
                                </div>

                            ) : (

                                <div className={style['other-img-message-wrapper-container']}>
                                    <img
                                        onClick={showBigImageHandler}
                                        value={msg.text} className={style['other-user-img-message']}
                                        src={msg.text} alt="my-img-message" key={msg.id}
                                    />
                                </div>
                            )
                        ) : (
                            <li
                                className={
                                    msg.userName === currentUserUsername
                                        ? style["myMessage-item"]
                                        : style["other-user-message-item"]
                                }
                                key={msg.id}
                            >
                                {msg.text}
                            </li>
                        )
                    ))} */}
                </section>

                <form
                    onSubmit={sendTextOrImageMessage}
                    className={style["chat-form"]}
                >
                    <input
                        ref={textMessageRef}
                        // onChange={(e) => setMessageText(e.target.value)}
                        className={style["message-text-container"]}
                        type="text"
                        // value={messageText}
                        placeholder="Type Something..."
                    />
                    <img
                        // onClick={sendTextOrImageMessage}
                        className={style["send-message-button"]}
                        // src={sendImageButton}
                        alt="Submit"
                    />

                    <button type="submit" hidden></button>
                </form>
            </article>

        </div>
    );
};