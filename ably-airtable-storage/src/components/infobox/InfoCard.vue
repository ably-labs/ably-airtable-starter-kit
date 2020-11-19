<template>
  <div class="background-info-container">
    <div class="card background-info-card">
      <div class="background-info-header text-white card-header">
        Play-by-play of behind the scenes
      </div>
      <div class="background-info-body card-body text-dark">
        <CurrentStatusText
          :backgroundInfoText="backgroundInfoText"
          :infoLinkText="infoLinkText"
          :infoLinkHref="infoLinkHref"
          :showSecondLink="showSecondLink"
        ></CurrentStatusText>
        <CodeSnippet
          v-if="showCodeSnippet"
          :whichCodeSnippet="whichCodeSnippet"
        ></CodeSnippet>
      </div>
    </div>
  </div>
</template>

<script>
import CodeSnippet from "./CodeSnippet.vue";
import CurrentStatusText from "./CurrentStatusText.vue";
import { backgroundEventBus } from "../../main.js";

export default {
  name: "InfoCard",
  components: { CodeSnippet, CurrentStatusText },
  props: ["chatMsgsArray"],
  data() {
    return {
      showCodeSnippet: false,
      backgroundInfoText: "",
      infoLinkText: "",
      infoLinkHref: "",
      showSecondLink: false,
      backgroundStatusList: {
        JOIN_CHAT: "join-chat",
        PUBLISH_MSG: "publish-msg",
        LIVE_MSGS_LOADED: "live-msgs-loaded",
        DB_MSGS_LOADED: "db-msgs-loaded",
      },
      currentBackgroundStatus: null,
      whichCodeSnippet: null,
    };
  },
  created() {
    this.backgroundInfoText =
      "Successfully connected to Ably Realtime, attached to the 'chat-airtable' channel with the rewind parameter set to 2min and added a subscription listener on that channel";
    this.infoLinkText = "Learn more about the 'Ably Rewind' channel param";
    this.infoLinkHref =
      "https://www.ably.io/documentation/realtime/channels/channel-parameters/rewind";
    this.whichCodeSnippet = "ably-connected";
    this.showCodeSnippet = true;
    backgroundEventBus.$on("updateBackgroundEventStatus", (data) => {
      switch (data) {
        case this.backgroundStatusList.JOIN_CHAT:
          this.backgroundInfoText =
            "Joined the chat by entering the presence set. ";
          if (this.chatMsgsArray.length > 0) {
            this.backgroundInfoText +=
              "Received " + this.chatMsgsArray.length + " rewound messages";
          }
          this.whichCodeSnippet = "ably-presence";
          this.infoLinkText = "Learn more about the 'Ably Presence' feature";
          this.infoLinkHref =
            "https://www.ably.io/documentation/realtime/presence";
          this.showSecondLink = false;
          break;
        case this.backgroundStatusList.PUBLISH_MSG:
          this.backgroundInfoText =
            "Published a message and received it as a live subscription update";
          this.whichCodeSnippet = "ably-pubsub";
          this.infoLinkText = "Learn more about the 'Ably Pub/Sub' feature";
          this.infoLinkHref = "https://www.ably.io/pub-sub-messaging";
          this.showSecondLink = false;
          break;
        case this.backgroundStatusList.LIVE_MSGS_LOADED:
          this.backgroundInfoText =
            "Received a new message as a live subscription update";
          this.whichCodeSnippet = "ably-sub-only";
          this.infoLinkText = "Learn more about the 'Ably Pub/Sub' feature";
          this.infoLinkHref = "https://www.ably.io/pub-sub-messaging";
          this.showSecondLink = false;
          break;
        case this.backgroundStatusList.DB_MSGS_LOADED:
          this.backgroundInfoText =
            "Received 3 old messages from the Airtable database";
          this.whichCodeSnippet = "airtable-db";
          this.infoLinkText = "Check out the Airtable REST API";
          this.infoLinkHref = "https://airtable.com/api";
          this.showSecondLink = true;
          break;
      }
    });
  },
};
</script>

<style>
.background-info-container {
  min-width: 50%;
  max-width: 50%;
}
.background-info-card {
  border: 1px solid #f5f5f6;
  min-height: 90vh;
  max-height: 90vh;
}

.background-info-header {
  font-size: 20px;
  border-bottom: 2px solid #f5f5f6;
  background-color: #292831;
}
.background-info-body {
  overflow: auto;
}
</style>
