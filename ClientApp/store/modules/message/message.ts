import { initialMessageState, MessageState } from './state';
import { RootState } from './../../store';
import { getStoreBuilder } from "vuex-typex";

import { appendMessages, setInitialMessages } from './mutations';
import { fetchInitialMessages, fetchMessages } from './actions';

export const moduleName = "message";
export const storeBuilder = getStoreBuilder<RootState>().module(
  moduleName,
  initialMessageState
);
// getters
const messagesGetter = storeBuilder.read((state: MessageState) => state.messages, nameof(initialMessageState.messages));
const lastFetchedMessageDateGetter = storeBuilder.read(
  (state: MessageState) => state.lastFetchedMessageDate,
  nameof(initialMessageState.lastFetchedMessageDate)
);

// state
const stateGetter = storeBuilder.state();

// exported "message" module interface
export class MessageStoreClient {
  // state
  get state() {
    return stateGetter();
  }

  // getters (wrapped as real getters)
  get messages() {
    return messagesGetter();
  }

  get lastFetchedMessageDate() {
    return lastFetchedMessageDateGetter();
  }

  // mutations
  public commitSetInitialMessages = storeBuilder.commit(
    setInitialMessages,
    nameof(setInitialMessages)
  )

  public commitAppendMessages = storeBuilder.commit(
    appendMessages,
    nameof(appendMessages)
  )

  // actions
  public dispatchFetchInitialMessages = storeBuilder.dispatch(
    fetchInitialMessages,
    nameof(fetchInitialMessages)
  )
  public dispatchFetchMessages = storeBuilder.dispatch(
    fetchMessages,
    nameof(fetchMessages)
  )
};

const message = new MessageStoreClient;

export default message;
