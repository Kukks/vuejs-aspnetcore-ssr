<template>
    <div>
        <Message v-for="(msg, index) in messages" :message="msg" :key="index" />
        <button @click="fetchMessages(lastFetchedMessageDate)">Fetch a message</button>
    </div>
</template>

<script lang="ts">
import Message from "./Message.vue";
import Component from "vue-class-component";
import Vue from "vue";
import { Store } from "vuex";
import message from "../store/modules/message";

@Component({
  components: {
    Message
  }
})
export default class MessagesComponent extends Vue {
  get messages() {
    return message.messages;
  }
  get lastFetchedMessageDate() {
    return message.lastFetchedMessageDate;
  }

  fetchMessages(date: Date | -1) {
    return message.dispatchFetchMessages(date);
  }

  static asyncData(payload: {  store: Store<any>, context: { origin?:string;}  }) {
    const isServer = typeof window === "undefined";
    let origin =
      payload && payload.context && payload.context.origin
        ? payload.context.origin
        : isServer ? "" : window.location.origin;
    return message.dispatchFetchInitialMessages(origin);
  }
}
</script>
