<template>
  <div class="input-group input-div">
    <input
      type="text"
      class="form-control chat-input"
      placeholder="Send a message..."
      aria-label="Send a message..."
      aria-describedby="button-addon2"
      v-model="myMessageContent"
      @keyup.enter="publishMessage()"
    />
    <div class="input-group-append send-btn-div">
      <button
        class="btn send-btn"
        type="button"
        id="button-addon2"
        @click="publishMessage()"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { backgroundEventBus } from "../../main.js";
import axios from "axios";

export default {
  name: "InfoCard",
  props: ["chatChannelInstance", "clientUsername", "myClientId"],
  data() {
    return {
      myMessageContent: "",
      msgPayload: null,
      myUsername: null,
      profanityBaseURL: "https://www.purgomalum.com/service/plain?text=",
      myFilteredMessage: "",
    };
  },
  methods: {
    async publishMessage() {
      if (this.myMessageContent != "") {
        //await this.filterMessage();
        const uniqueMsgId =
          "id-" +
          Math.random()
            .toString(36)
            .substr(2, 16);

        this.msgPayload = {
          clientId: this.myClientId,
          msgId: uniqueMsgId,
          username: this.clientUsername,
          messageContent: this.myMessageContent,
        };

        this.chatChannelInstance.publish("chat-msg", {
          originalChatMessage: this.msgPayload,
        });
        backgroundEventBus.$emit("updateBackgroundEventStatus", "publish-msg");
        this.myMessageContent = "";
      }
    },
    async filterMessage() {
      const encodedMessage = encodeURIComponent(this.myMessageContent);
      await axios
        .get(this.profanityBaseURL + encodedMessage + "&fill_text=***")
        .then((filteredMessage) => {
          this.myFilteredMessage = filteredMessage.data;
        });
      return;
    },
  },
};
</script>
<style scoped>
.input-div {
  border: 1px solid #292831;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 40px;
}

.chat-input {
  border: none;
  background-color: white;
}

.send-btn {
  border-left: 0px;
  border-right: 0px;
  border-top: 0px;
  border-bottom: 0px;
  border-radius: 0px;
  background-color: #292831;
  color: #f5f5f6;
  border-left: 1px solid black;
}

.send-btn:hover {
  background-color: #f5f5f6;
  color: #292831;
  border-left: 1px solid black;
}

.send-btn:active {
  background-color: #76767c;
  color: #f5f5f6;
}
</style>
