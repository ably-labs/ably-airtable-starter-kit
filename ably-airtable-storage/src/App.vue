<template>
  <div id="app" class="app-container" v-if="this.isAblyConnected">
    <ChatWindow
      :chatChannelInstance="chatChannelInstance"
      :myClientId="myClientId"
    ></ChatWindow>
    <BackgroundInfo></BackgroundInfo>
  </div>
</template>

<script>
import ChatWindow from "./components/ChatWindow.vue";
import BackgroundInfo from "./components/BackgroundInfo.vue";
import * as Ably from "ably";
export default {
  name: "App",
  components: {
    ChatWindow,
    BackgroundInfo,
  },
  data() {
    return {
      ablyRealtimeInstance: null,
      isAblyConnected: false,
      chatChannelId: "[?rewind=2m]chat-airtable",
      chatChannelInstance: null,
      myClientId: "",
    };
  },
  created() {
    const uniqueId =
      "id-" +
      Math.random()
        .toString(36)
        .substr(2, 16);

    this.ablyRealtimeInstance = new Ably.Realtime({
      key: "",
      clientId: uniqueId,
    });
    this.myClientId = uniqueId;
    this.ablyRealtimeInstance.connection.on("connected", () => {
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
  margin-top: 60px;
}

.app-container {
  display: flex;
  justify-content: space-around;
}
</style>
