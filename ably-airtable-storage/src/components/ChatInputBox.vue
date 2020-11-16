<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control chat-input"
      placeholder="Send a message..."
      aria-label="Send a message..."
      aria-describedby="button-addon2"
      v-model="myMessageContent"
    />
    <div class="input-group-append">
      <button
        class="btn btn-secondary"
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
export default {
  name: "BackgroundInfo",
  props: ["chatChannelInstance", "clientUsername", "myClientId"],
  data() {
    return {
      myMessageContent: null,
      msgPayload: null,
      myUsername: null,
    };
  },
  methods: {
    publishMessage() {
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
      this.myMessageContent = "";
    },
  },
};
</script>
<style scoped></style>
