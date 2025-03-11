import { FormEvent, useRef } from "react";
import style from "./Chat.module.css";

import audioCallingImg from "../../../../images/audio-call.png";
import videoCallImg from "../../../../images/video_call.png";
import deffaultUserImage from "../../images/deffault-user-image.jpg";
import deffaultBackground from "../../../../images/deffault-chat-component-img.jpg";

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
};

export const Chat = ({
    user,
    webSocket,
    incomingCall,
    setIncomingCall,
    currentChatFriend,
    messagesWithCurrentFriend,
    setMessagesWithCurrentFriend,

    openCallSection,
    setOpenCallSection,
}: ChatProps) => {
   
    const textMessageRef = useRef<HTMLInputElement | null>(null);
    const receiverRef = useRef<HTMLHeadingElement | null>(null);

    // Изпращане на текстови съобщения (ако има чат функционалност)
    const sendTextOrImageMessage = (event: FormEvent) => {
        debugger;
        event.preventDefault();
        if (!webSocket || !textMessageRef.current || !user || !receiverRef.current) return;

        const message: Message = {
            messageText: textMessageRef.current.value,
            owner: user.id,
            receiver: currentChatFriend ? currentChatFriend?.realUserId : "",
            messageType: MessageType.TEXT,
            createdOn: new Date().toISOString(),
        };

        let newMessage: Message[] = [];
        if (messagesWithCurrentFriend != null) {
            newMessage = [...messagesWithCurrentFriend];
        }

        newMessage.push(message);
        setMessagesWithCurrentFriend(newMessage);

        webSocket.send(JSON.stringify(message));
    };

    // Тази функция се извиква, когато ти (caller) щракнеш на иконката за видео обаждане.
    const openCallSectionHandler = (receivedCallType: string) => {
        // Отваряме Call Секцията:
        if (!openCallSection) {
            const videoCallNotification: CallNotification = {
                caller: user ? user?.id : "",
                receiver: currentChatFriend ? currentChatFriend.realUserId : "",
                callId: uuidv4(),
                callType: receivedCallType,
                channelName: `call_${user!.username}_${receiverRef.current?.textContent}`,
                timestamp: new Date().toISOString(),
                callerNames: user ? user?.firstName + " " + user?.lastName : "",
                callerImgUrl: user?.profileImageURL ?? "",
            };

            // Записваме данните, за да ги подадем на VideoCall компонента
            setIncomingCall(videoCallNotification);
            // Изпращаме известие към сървъра
            if (webSocket) {
                webSocket.send(JSON.stringify(videoCallNotification));
                console.log("Sent video call request:", videoCallNotification);
            };
        };
        // Отваряме VideoCall компонента – caller веднага влиза в обаждането и чака другия участник
        setOpenCallSection(true);
    };

    return (
        <div>
            {/* {incomingCall && incomingCall.caller !== user?.username && (
                <div>
                    <h3 className={style['incoming-call-h3-notification']}>Входящо обаждане от: {incomingCall.caller}</h3>
                    <button>Откажи</button>
                    <button onClick={() => setOpenCallSection(true)}>Приеми</button>
                </div>
            )} */}

            

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
                        src={currentChatFriend?.profileImageURL ? currentChatFriend?.profileImageURL : deffaultUserImage}
                        alt="friend-img"
                    />
                    <h2
                        ref={receiverRef}
                        className={style["username-title"]}
                    >
                        {currentChatFriend && currentChatFriend.username}
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




                {/* Messages Section: */}
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

                    {messagesWithCurrentFriend && messagesWithCurrentFriend.map((msg, index) => (
                        isValidImageUrl(msg.messageText) ? (msg.owner === user?.username ? (

                            <div className={style['img-message-wrapper-container']}>
                                <img
                                    // onClick={showBigImageHandler}
                                    // onMouseEnter={() => setIsHovered(true)}
                                    // onMouseLeave={() => setIsHovered(false)}
                                    // value={msg.messageText} 
                                    className={style['my-img-message']}
                                    src={msg.messageText}
                                    key={msg.receiver + msg.owner + index}
                                    alt="my-img-message"
                                />
                            </div>

                        ) : (

                            <div className={style['other-img-message-wrapper-container']}>
                                <img
                                    // onClick={showBigImageHandler}
                                    // value={msg.text} 
                                    className={style['other-user-img-message']}
                                    src={msg.messageText}
                                    key={msg.receiver + msg.owner + index}
                                    alt="my-img-message"
                                />
                            </div>
                        )
                        ) : (
                            <>
                                {/* <h6 className={style['message-date']}>{new Date(msg.createdOn.replace(/^(\d{2})-(\d{2})-(\d{2})/, '20$1-$2-$3')).toLocaleString()}</h6> */}
                                <li
                                    className={
                                        msg.owner === user?.id
                                            ? style["myMessage-item"]
                                            : style["other-user-message-item"]
                                    }
                                    key={msg.receiver + msg.owner + index}
                                >
                                    {msg.messageText}
                                </li>
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