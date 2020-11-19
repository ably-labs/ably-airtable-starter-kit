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

export default {
  name: "BackgroundInfo",
  props: ["chatChannelInstance", "clientUsername", "myClientId"],
  data() {
    return {
      myMessageContent: "",
      msgPayload: null,
      myUsername: null,
    };
  },
  methods: {
    publishMessage() {
      if (this.myMessageContent != "") {
        const uniqueMsgId =
          "id-" +
          Math.random()
            .toString(36)
            .substr(2, 16);

        this.msgPayload = [
          {
            fields: {
              clientId: this.myClientId,
              msgId: uniqueMsgId,
              username: this.clientUsername,
              "chat-message": this.myMessageContent,
            },
          },
        ];

        this.chatChannelInstance.publish("chat-msg", {
          records: this.msgPayload,
        });
        backgroundEventBus.$emit("updateBackgroundEventStatus", "publish-msg");
        this.myMessageContent = "";
      }
    },
  },
};
</script>
<style scoped>
.input-div {
  border-left: 2px solid;
  border-right: 2px solid;
  border-bottom: 2px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(228, 0, 0, 1) 25%,
    rgba(255, 84, 22, 1) 90%
  );
  border-image-slice: 1;
  border-radius: 5px;
  height: 40px;
}

.chat-input {
  border: none;
  background-color: white;
}

.send-btn {
  border-left: 2px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(228, 0, 0, 1) 25%,
    rgba(255, 84, 22, 1) 90%
  );
  border-image-slice: 1;
  border-right: 0px;
  border-top: 0px;
  border-bottom: 0px;
}

.send-btn:hover {
  background-color: #292831;
  color: #f5f5f6;
}

.send-btn:active {
  background-color: #76767c;
  color: #f5f5f6;
}
</style>
