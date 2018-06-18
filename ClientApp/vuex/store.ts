import Vue from 'vue'
import Vuex from 'vuex'
import { fetchInitialMessages, fetchMessages } from './actions'
import * as _ from 'lodash';


Vue.use(Vuex)

const store = new Vuex.Store({
  state: { messages: [], lastFetchedMessageDate: -1 },

  mutations: {
    INITIAL_MESSAGES: (state, payload) => {
      state.messages = payload.messages
      state.lastFetchedMessageDate = payload.lastFetchedMessageDate
    },
    FETCH_MESSAGES: (state, payload) => {
      state.messages = state.messages.concat(payload.messages)
      const min = _.minBy(state.messages, 'date')
      state.lastFetchedMessageDate = min ? (min as any).date : null
    }
  },
  actions: {
    fetchInitialMessages,
    fetchMessages
  },
  getters: {
    messages: state => state.messages,
    lastFetchedMessageDate: state => state.lastFetchedMessageDate
  }
})

export default store
