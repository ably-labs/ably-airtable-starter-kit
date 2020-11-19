<template>
  <div
    class="chat-message-container"
    :class="{
      'msg-left': !isMsgMine,
      'msg-right': isMsgMine,
    }"
  >
    <div
      class="card text-white chat-message "
      :class="{
        'msg-bg-right': isMsgMine,
        'msg-bg-left': !isMsgMine,
        'card-rounded-right-only': !isMsgMine,
        'card-rounded-left-only': isMsgMine,
      }"
    >
      <div class="card-body">
        <p class="card-text message-text">
          {{ message.messageContent["chat-message"] }}
        </p>
        <p class="card-text meta-text">
          <small class=""
            >at {{ messageTime12HrFormat }} by
            {{ message.messageContent.username }}</small
          >
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
      isMsgMine: null,
      msgType: null,
      timeHours: null,
      timeMinutes: null,
      timeAMPM: null,
    };
  },
  methods: {
    computeLiveMsgTime() {
      const messageTime24HrFormat = new Date(this.message.msgTimestamp);
      let hours = messageTime24HrFormat.getHours();
      let minutes = messageTime24HrFormat.getMinutes();
      this.convertTo12HrFormat(hours, minutes);
    },
    convertTo12HrFormat(hours, minutes) {
      minutes = (minutes < 10 ? "0" : "") + minutes;
      let ampm = hours < 12 ? "am" : "pm";
      hours = hours % 12 || 12;
      this.formatTime(hours, minutes, ampm);
    },
    formatTime(hours, minutes, ampm) {
      this.messageTime12HrFormat = `${hours}:${minutes} ${ampm}`;
    },
    computeDbMsgTime() {
      const dbDateTimeUTC = this.message.messageContent["created-time"];
      let year = dbDateTimeUTC.substr(0, 4);
      let month = dbDateTimeUTC.substr(5, 2);
      let day = dbDateTimeUTC.substr(8, 2);
      let time = dbDateTimeUTC.substr(11, 8);
      let localDateTime = new Date(`${year}/${month}/${day} ${time} UTC`);
      this.convertTo12HrFormat(
        localDateTime.getHours(),
        localDateTime.getMinutes()
      );
    },
  },
  created() {
    this.isMsgMine = this.message.messageContent.clientId === this.myClientId;
    this.msgType = this.message.messageContent.msgType;
    if (this.message.msgType == "live") {
      this.computeLiveMsgTime();
    } else if (this.message.msgType == "db") {
      this.computeDbMsgTime();
    }
  },
};
</script>

<style scoped>
.chat-message-container {
  display: flex;
  margin: 10px 0px;
}
.msg-bg-left {
  background-color: #e40000;
}
.msg-bg-right {
  background-color: #292831;
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

.card-rounded-right-only {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border: none;
}

.card-rounded-left-only {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: none;
}

.message-text {
  text-align: left;
  margin: 0px;
}

.meta-text {
  text-align: right;
  color: #e9e9e9;
}
</style>
