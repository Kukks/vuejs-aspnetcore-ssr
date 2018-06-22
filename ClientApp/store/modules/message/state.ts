export interface Message {
    date: Date;
    title: string;
    text: string;
}

export interface MessageState {
    messages: Message[];
    lastFetchedMessageDate: -1 | Date;
}

export const initialMessageState: MessageState = {
    messages: [],
    lastFetchedMessageDate: -1
};

