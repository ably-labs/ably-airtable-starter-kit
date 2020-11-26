<template>
  <div id="app" class="app-container" v-if="this.isAblyConnected">
    <ChatCard
      :chatChannelInstance="chatChannelInstance"
      :myClientId="myClientId"
      :chatMsgsArray="chatMsgsArray"
    ></ChatCard>
    <InfoCard :chatMsgsArray="chatMsgsArray"></InfoCard>
  </div>
</template>

<script>
import ChatCard from "./components/chatbox/ChatCard.vue";
import InfoCard from "./components/infobox/InfoCard.vue";
import * as Ably from "ably";

export default {
  name: "App",
  components: {
    ChatCard,
    InfoCard,
  },
  data() {
    return {
      chatMsgsArray: [],
      ablyRealtimeInstance: null,
      isAblyConnected: false,
      chatChannelId: "[?rewind=2m]chat-airtable",
      chatChannelInstance: null,
      myClientId: "",
    };
  },
  methods: {},
  created() {
    this.ablyRealtimeInstance = new Ably.Realtime({
      authUrl: "/auth",
    });
    this.ablyRealtimeInstance.connection.once("connected", () => {
      this.myClientId = this.ablyRealtimeInstance.auth.clientId;
      this.isAblyConnected = true;
      this.chatChannelInstance = this.ablyRealtimeInstance.channels.get(
        this.chatChannelId
      );
    });
  },
  destroyed() {
    this.ablyRealtimeInstance.connection.close();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.app-container {
  display: flex;
  justify-content: space-around;
}
</style>
