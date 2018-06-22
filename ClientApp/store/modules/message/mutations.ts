import { MessageState } from './state';
import { minBy } from 'lodash';

export function setInitialMessages(state: MessageState, payload: MessageState) {
    state.messages = payload.messages;
    state.lastFetchedMessageDate = payload.lastFetchedMessageDate;
  }
  
export function appendMessages(state: MessageState, payload: MessageState) {
    state.messages = state.messages.concat(payload.messages);
    const min = minBy(state.messages, nameof(state.messages[0].date));
    state.lastFetchedMessageDate = min ? min.date : -1;
  }