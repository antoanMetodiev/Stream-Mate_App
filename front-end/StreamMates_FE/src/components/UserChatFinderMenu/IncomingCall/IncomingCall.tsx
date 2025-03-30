import style from "./IncomingCall.module.css";

import deffaultUserImg from "../images/deffault-user-image.jpg";
import rejectCallImg from "../images/leave-channel.png";
import acceptCallImg from "../images/audio-call.png";

import { CallNotification } from "../../../types/CallNotification";
import { useState } from "react";

import skypeSound from "./../../../audios/_SKYPE CALL SOUND.mp3";

interface IncomingCallProps {
    incomingCall: CallNotification;
    setOpenCallSection: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRinging: React.Dispatch<React.SetStateAction<boolean>>;
    openCallSection: boolean;
    isRinging: boolean;
}

export const IncomingCall = ({
    incomingCall,
    setOpenCallSection,
}: IncomingCallProps) => {
    const [ringMyAudio, setRingMyAudio] = useState(true);

    return (
        <div className={style['incoming-call-container-wrapper']}>
            {ringMyAudio && <audio src={skypeSound} loop autoPlay />}

            <div className={style['caller-container-wrapper']}>
                <img src={incomingCall.callerImgUrl ? incomingCall.callerImgUrl : deffaultUserImg} alt="callerImgUrl" />
                <h3 className={style['incoming-call-h3-notification']}>{incomingCall.callerNames}</h3>
            </div>
            <div className={style['accept-reject-container-imgs-wrapper']}>
                <img onClick={() => {

                    setOpenCallSection(true);
                    setRingMyAudio(false);

                }} src={acceptCallImg} alt="acceptCallImg" />
                <img src={rejectCallImg} alt="rejectCallImg" />
            </div>
        </div>
    )
}