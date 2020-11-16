<template>
  <div
    class="chat-message-container"
    :class="{
      'msg-left': !isMsgMine,
      'msg-right': isMsgMine,
    }"
  >
    <div
      class="card text-white bg-primary chat-message"
      :class="{ 'bg-primary': isMsgMine, 'bg-secondary': !isMsgMine }"
    >
      <div class="card-body">
        <p class="card-text message-text">
          {{ message.messageContent["chat-message"] }}
        </p>
        <p class="card-text meta-text">
          <small class="text-white">{{ messageTime12HrFormat }}</small>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChatMessage",
  props: ["message", "myClientId"],
  data() {
    return {
      messageTime12HrFormat: null,
      isMessageMine: null,
    };
  },
  methods: {
    formatTime(hours, minutes, ampm) {
      this.messageTime12HrFormat = `${hours}:${minutes} ${ampm}`;
    },
  },
  created() {
    const messageTime24HrFormat = new Date(this.message.msgTimestamp);
    let hours = messageTime24HrFormat.getHours();
    let minutes = messageTime24HrFormat.getMinutes();
    minutes = (minutes < 10 ? "0" : "") + minutes;
    let ampm = hours < 12 ? "am" : "pm";
    hours = hours % 12 || 12;
    this.formatTime(hours, minutes, ampm);

    this.isMsgMine = this.message.messageContent.clientId === this.myClientId;
  },
};
</script>

<style scoped>
.chat-message-container {
  display: flex;
  margin: 10px 0px;
}

.msg-left {
  justify-content: flex-start;
}

.msg-right {
  justify-content: flex-end;
}

.chat-message {
  max-width: 60%;
  padding: 0px;
}

.card-body {
  padding: 10px;
}

.message-text-right {
  margin: 0px;
}

.meta-text {
  text-align: right;
}
</style>
