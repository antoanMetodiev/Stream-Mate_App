import { MessageType } from "./enums/MessageType";

export type Message = {
    messageText: string,
    owner: string,
    receiver: string,
    messageType: MessageType
    createdOn: string,
};