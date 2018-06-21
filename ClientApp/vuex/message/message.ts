// path: store/basket/basket.ts (module)

import { RootState } from "../store";
import { getStoreBuilder, BareActionContext } from "vuex-typex";
import axios from "axios";
import { minBy } from "lodash";

export interface Message {
  date: Date;
  title: string;
  text: string;
}

export interface MessageState {
  messages: Message[];
  lastFetchedMessageDate: -1 | Date;
}

const initialMessageState: MessageState = {
  messages: [],
  lastFetchedMessageDate: -1
};
const storeBuilder = getStoreBuilder<RootState>().module(
  "message",
  initialMessageState
);

// getters
const messagesGetter = storeBuilder.read(state => state.messages, "messages");
const lastFetchedMessageDateGetter = storeBuilder.read(
  state => state.lastFetchedMessageDate,
  "lastFetchedMessageDate"
);

// mutations

function setInitialMessages(state: MessageState, payload: MessageState) {
  state.messages = payload.messages;
  state.lastFetchedMessageDate = payload.lastFetchedMessageDate;
}

function appendMessages(state: MessageState, payload: MessageState) {
  state.messages = state.messages.concat(payload.messages);
  const min = minBy(state.messages, nameof(state.messages[0].date));
  state.lastFetchedMessageDate = min ? min.date : -1;
}

// action

async function fetchInitialMessages(
  _context: BareActionContext<MessageState, RootState>,
  origin: string
) {
  // this one will run on server so it need FQDN or server won't able to resolve the API address
  const response = await axios.get(`${origin}/initialMessages`);
  message.commitSetInitialMessages(response.data);
}

async function fetchMessages(
  _context: BareActionContext<MessageState, RootState>,
  lastFetchedMessageDate: Date | -1
) {
  const response = await axios.post("/fetchMessages", {
    lastMessageDate: lastFetchedMessageDate
  });
  message.commitAppendMessages(response.data);
}

// state
const stateGetter = storeBuilder.state();

// exported "message" module interface
const message = {
  // state
  get state() {
    return stateGetter();
  },

  // getters (wrapped as real getters)
  get messages() {
    return messagesGetter();
  },

  get lastFetchedMessageDate() {
    return lastFetchedMessageDateGetter();
  },

  // mutations
  commitSetInitialMessages: storeBuilder.commit(
    setInitialMessages,
    nameof(setInitialMessages)
  ),
  commitAppendMessages: storeBuilder.commit(
    appendMessages,
    nameof(appendMessages)
  ),

  // actions
  dispatchFetchInitialMessages: storeBuilder.dispatch(
    fetchInitialMessages,
    nameof(fetchInitialMessages)
  ),
  dispatchFetchMessages: storeBuilder.dispatch(
    fetchMessages,
    nameof(fetchMessages)
  )
};

export default message;
