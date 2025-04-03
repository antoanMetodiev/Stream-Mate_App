import { FormEvent, useEffect, useRef } from "react";
import style from "./Chat.module.css";

import audioCallingImg from "../../../../images/audio-call.png";
import videoCallImg from "../../../../images/video_call.png";
import deffaultUserImage from "../../images/deffault-user-image.jpg";
import deffaultBackground from "../../../../images/deffault-chat-component-img.webp";
import chatOptions from "../../../../images/chat-options.png";
import backToUsersListImg from "../../../../images/back-to-users-list.png";
import onlineImgIcon from "../../../../images/online-image.jpg";
import sendMessageIcon from "../../../../images/send-message.png";

import { v4 as uuidv4 } from "uuid"; // За генериране на уникално callId
import { User } from "../../../../types/User";
import { CallNotification } from "../../../../types/CallNotification";
import { Message } from "../../../../types/Message";
import { MessageType } from "../../../../types/enums/MessageType";
import { Friend } from "../../../../types/Friend";

function isValidImageUrl(url: string) {
    const pattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico|tiff?))(?:\?.*)?$/i;
    const flexiblePattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico|tiff?))(\?.*)?$/i;
    const keywordsPattern = /images|media|photo|photos|gallery|picture|img/i;
    return pattern.test(url) || flexiblePattern.test(url) || keywordsPattern.test(url);
}

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

interface ChatProps {
    user: User | null;
    webSocket: WebSocket | null;
    incomingCall: CallNotification | null;
    currentChatFriend: Friend | null;
    messagesWithCurrentFriend: Message[] | null;
    setMessagesWithCurrentFriend: React.Dispatch<React.SetStateAction<Message[] | []>>;
    setIncomingCall: React.Dispatch<React.SetStateAction<CallNotification | null>>;

    openCallSection: boolean;
    setOpenCallSection: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenMessagesWithUser: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRinging: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Chat = ({
    user,
    webSocket,
    setIncomingCall,
    currentChatFriend,
    messagesWithCurrentFriend,
    setMessagesWithCurrentFriend,

    openCallSection,
    setOpenCallSection,
    setIsOpenMessagesWithUser,
    setIsRinging
}: ChatProps) => {

    const messagesContainerRef = useRef<HTMLElement | null>(null);
    const textMessageRef = useRef<HTMLInputElement | null>(null);
    const receiverRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messagesWithCurrentFriend]);


    // Изпращане на текстови съобщения (ако има чат функционалност)
    const sendTextOrImageMessage = (event: FormEvent) => {
        event.preventDefault();
        if (!webSocket || !textMessageRef.current || !user || !receiverRef.current) return;

        const message: Message = {
            messageText: textMessageRef.current.value,
            owner: user.id,
            receiver: currentChatFriend?.realUserId || "",
            messageType: MessageType.TEXT,
            createdOn: new Date().toISOString(),
        };

        setMessagesWithCurrentFriend(prevMessages => [...(prevMessages || []), message]);
        webSocket.send(JSON.stringify(message));
        textMessageRef.current.value = "";
    };

    // Тази функция се извиква, когато ти (caller) щракнеш на иконката за видео обаждане.
    const openCallSectionHandler = (receivedCallType: string) => {
        // Отваряме Call Секцията:
        if (!openCallSection) {
            const callNotification: CallNotification = {
                caller: user ? user?.id : "",
                receiver: currentChatFriend?.realUserId || "",
                callId: uuidv4(),
                callType: receivedCallType,
                channelName: `call_${user!.username}_${receiverRef.current?.textContent}`,
                timestamp: new Date().toISOString(),
                callerNames: user ? user?.fullName : "",
                callerImgUrl: user?.profileImageURL ?? "",
                messageText: `${user?.fullName} започна обаждане!`,
            };

            const currentMessageType: MessageType = receivedCallType == "VIDEO_CALL" ? MessageType.VIDEO_CALL : MessageType.AUDIO_CALL;
            let saveMessage: Message = {
                owner: callNotification.caller,
                createdOn: callNotification.timestamp,
                receiver: callNotification.receiver,
                messageText: callNotification.messageText,
                messageType: currentMessageType,
            }
            setMessagesWithCurrentFriend(prevMessages => [...(prevMessages || []), saveMessage]);
            setIncomingCall(callNotification);

            // Изпращаме известие към сървъра
            if (webSocket) {
                webSocket.send(JSON.stringify(callNotification));
                console.log("Sent Call request:", callNotification);
            };
        };
        // Отваряме VideoCall компонента – caller веднага влиза в обаждането и чака другия участник
        setOpenCallSection(true);
    };

    console.log(messagesWithCurrentFriend);

    return (
        <div>

            <article
                className={style["chat-container-wrapper"]}
            >
                <div
                    className={style['all-background-videos-container']}>
                </div>

                <header className={style["username-and-avatar"]}>
                    <img
                        className={style["current-friend-img"]}
                        src={currentChatFriend?.profileImageURL ? currentChatFriend?.profileImageURL : deffaultUserImage}
                        alt="friend-img"
                    />
                    <h2
                        ref={receiverRef}
                        className={style["username-title"]}
                    >
                        {currentChatFriend && currentChatFriend.username.length > 8 ? "@" + currentChatFriend.username.slice(0, 8) + ".." : "@" + currentChatFriend?.username}
                    </h2>
                    <p className={style["online-label"]}>online</p>
                    <img
                        className={style["online-image"]}
                        src={onlineImgIcon}
                        alt="online-image"
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
                        onClick={() => {
                            openCallSectionHandler("AUDIO_CALL");
                            setIsRinging(true);
                        }}
                        className={style['audio-call-img']}
                        src={audioCallingImg}
                        alt="audioCallingImg"
                    />

                    <img
                        onClick={() => {
                            openCallSectionHandler("VIDEO_CALL");
                            setIsRinging(true);
                        }}
                        className={style["video-call-img"]}
                        src={videoCallImg}
                        alt="videoCallImg"
                    />

                    <img
                        className={style["chat-options"]}
                        src={chatOptions}
                        alt="chatOptions"
                    />

                    <img
                        onClick={() => { setIsOpenMessagesWithUser(false) }}
                        className={style["back-to-users-list"]}
                        src={backToUsersListImg}
                        alt="backToUsersListImg"
                    />
                </header>


                {/* Blocked User: */}
                <div
                    // ref={youAreBlockedContainerRef}
                    className={style['blocked-user-container']}>
                    <h2>Blocked User!</h2>
                </div>




                {/* Messages Section: */}
                <section
                    ref={messagesContainerRef}
                    className={style["messages-section"]}
                >
                    <p className={style['shadow']}></p>
                    <img
                        className={style['message-section-wallper-img']}
                        src={deffaultBackground}
                        alt="deffaultBackground"
                    />

                    {messagesWithCurrentFriend && messagesWithCurrentFriend.map((msg, index) => (
                        isValidImageUrl(msg.messageText) ? (msg.owner === user?.id ? (

                            <div className={style['img-message-wrapper-container']}>
                                <img
                                    className={style['my-img-message']}
                                    src={msg.messageText}
                                    key={msg.receiver + msg.owner + index}
                                    alt="my-img-message"
                                />
                            </div>

                        ) : (

                            <div className={style['other-img-message-wrapper-container']}>
                                <img
                                    className={style['other-user-img-message']}
                                    src={msg.messageText}
                                    key={msg.receiver + msg.owner + index}
                                    alt="my-img-message"
                                />
                            </div>
                        )
                        ) : (
                            <>
                                {msg.messageType == MessageType.VIDEO_CALL || msg.messageType == MessageType.AUDIO_CALL ? (

                                    <>
                                        <h5 className={style['call-creation-date']}
                                        >
                                            {formatDate(msg.createdOn)}
                                        </h5>
                                        <h3 className={style['call-message-h3']}>{msg.messageText.replace(" аудио ", " ")}</h3>
                                    </>
                                ) : (
                                    <>
                                        <h5 className={msg.owner === user?.id
                                            ? style["my-message-creation-date"]
                                            : style["other-message-creation-date"]}
                                        >
                                            {formatDate(msg.createdOn)}
                                        </h5>
                                        <li
                                            key={msg.receiver + msg.owner + index}
                                            className={
                                                msg.owner === user?.id
                                                    ? style["myMessage-item"]
                                                    : style["other-user-message-item"]
                                            }
                                        >
                                            {msg.messageText}
                                        </li >
                                    </>
                                )}
                            </>
                        )
                    ))}
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
                        placeholder="Type Something.."
                    />
                    <img
                        // onClick={sendTextOrImageMessage}
                        className={style["send-message-button"]}
                        src={sendMessageIcon}
                        alt="Submit"
                    />

                    <button type="submit" hidden></button>
                </form>
            </article>

        </div >
    );
};