import { MessageState } from './state';
import { RootState } from './../../store';
import message from './message';
import { BareActionContext } from 'vuex-typex';
import axios from "axios";

export async function fetchInitialMessages(
    _context: BareActionContext<MessageState, RootState>,
    origin: string
  ) {
    // this one will run on server so it need FQDN or server won't able to resolve the API address
    const response = await axios.get(`${origin}/initialMessages`);
    message.commitSetInitialMessages(response.data);
  }
  
 export  async function fetchMessages(
    _context: BareActionContext<MessageState, RootState>,
    lastFetchedMessageDate: Date | -1
  ) {
    const response = await axios.post("/fetchMessages", {
      lastMessageDate: lastFetchedMessageDate
    });
    message.commitAppendMessages(response.data);
  }