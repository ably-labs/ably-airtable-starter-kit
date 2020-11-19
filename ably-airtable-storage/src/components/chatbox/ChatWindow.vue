<template>
  <div class="chat-window-container">
    <div class="card chat-card">
      <div class="card-header chat-header">
        Group Chat Demo - Ably | Airtable
      </div>
      <div class="card-body chat-box " ref="chatMsgsBox">
        <Username
          v-if="!isReadyToChat"
          :saveUsernameAndJoin="saveUsernameAndJoin"
        ></Username>
        <template v-if="isReadyToChat">
          <div v-if="showLoadMoreBtn" class="load-more-div">
            <button
              type="button"
              class="btn load-more-btn"
              @click="loadPreviousMsgs()"
            >
              Load previous messages <span class="badge badge-light">⬆︎</span>
            </button>
          </div>
          <ChatMessage
            v-for="message in chatMsgsArray"
            :key="message.messageContent.msgId"
            :message="message"
            :myClientId="myClientId"
          ></ChatMessage>
        </template>
      </div>
      <div class="card-footer input-footer">
        <ChatInputBox
          v-if="isReadyToChat"
          :chatChannelInstance="chatChannelInstance"
          :clientUsername="clientUsername"
          :myClientId="myClientId"
        ></ChatInputBox>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage.vue";
import ChatInputBox from "./ChatInputBox.vue";
import Username from "./Username.vue";
import * as Airtable from "airtable";
import { backgroundEventBus } from "../../main.js";

export default {
  name: "ChatWindow",
  props: [
    "chatChannelInstance",
    "myClientId",
    "updateBackgroundStatus",
    "chatMsgsArray",
  ],
  components: {
    ChatMessage,
    ChatInputBox,
    Username,
  },
  data() {
    return {
      airData: null,
      isReadyToChat: false,
      clientUsername: "",
      isMsgMine: true,
      dbAutoNumber: null,
      base: null,
      latestMsgId: null,
      showLoadMoreBtn: true,
    };
  },
  methods: {
    saveUsernameAndJoin(username) {
      this.clientUsername = username;
      this.isReadyToChat = true;
      this.chatChannelInstance.presence.enter(username);
      backgroundEventBus.$emit("updateBackgroundEventStatus", "join-chat");
    },
    async handleNewMessage(msg) {
      let messageContent = msg.data.records[0].fields;
      let msgTimestamp = msg.timestamp;
      await this.chatMsgsArray.push({
        messageContent,
        msgTimestamp,
        msgType: "live",
      });
      if (this.$refs.chatMsgsBox) {
        let divScrollHeight = this.$refs.chatMsgsBox.scrollHeight;
        this.$refs.chatMsgsBox.scrollTop = divScrollHeight;
      }
      console.log(messageContent.clientId);
      if (messageContent.clientId != this.myClientId) {
        backgroundEventBus.$emit(
          "updateBackgroundEventStatus",
          "live-msgs-loaded"
        );
      }
    },
    loadPreviousMsgs() {
      if (this.chatMsgsArray[0]) {
        this.getMsgsFromDBWithMsgID();
      } else {
        this.getLatestMsgsFromDB();
      }
      backgroundEventBus.$emit("updateBackgroundEventStatus", "db-msgs-loaded");
    },
    getMsgsFromDBWithMsgID() {
      this.latestMsgId = this.chatMsgsArray[0].messageContent.msgId;
      this.showLoadMoreBtn = false;
      setTimeout(() => {
        this.showLoadMoreBtn = true;
      }, 2000);
      this.base = new Airtable({ apiKey: "" }).base("");
      let vueContext = this;

      this.base("Table 1")
        .select({
          view: "Grid view",
          filterByFormula: "SEARCH('" + vueContext.latestMsgId + "',{msgId})",
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function(record) {
              vueContext.dbAutoNumber = record.get("ID");
              vueContext.getMsgsFromDBWithAutoID();
              return;
            });
            fetchNextPage(vueContext.dbAutoNumber);
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
    },
    getMsgsFromDBWithAutoID() {
      let vueContext = this;
      this.base("Table 1")
        .select({
          maxRecords: 3,
          view: "Grid view",
          filterByFormula: "({ID}<" + vueContext.dbAutoNumber + ")",
          sort: [{ field: "ID", direction: "desc" }],
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(async function(record) {
              await vueContext.chatMsgsArray.unshift({
                messageContent: record.fields,
                msgTimestamp: 123,
                msgType: "db",
              });
              if (vueContext.$refs.chatMsgsBox) {
                vueContext.$refs.chatMsgsBox.scrollTop = 0;
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
    },
    getLatestMsgsFromDB() {
      this.base = new Airtable({ apiKey: "" }).base("");
      let vueContext = this;
      this.base("Table 1")
        .select({
          maxRecords: 3,
          view: "Grid view",
          sort: [{ field: "ID", direction: "desc" }],
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(async function(record) {
              await vueContext.chatMsgsArray.unshift({
                messageContent: record.fields,
                msgTimestamp: 123,
                msgType: "db",
              });
              if (vueContext.$refs.chatMsgsBox) {
                vueContext.$refs.chatMsgsBox.scrollTop = 0;
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
    },
  },
  created() {
    this.isReadyToChat = false;
    this.chatChannelInstance.subscribe((msg) => {
      this.handleNewMessage(msg);
    });
  },
};
</script>

<style>
.chat-window-container {
  min-width: 40%;
  max-width: 40%;
  border: none;
}

.chat-card {
  min-height: 700px;
  max-height: 700px;
}
.chat-header {
  border: none;
  background: linear-gradient(
    90deg,
    rgba(228, 0, 0, 1) 25%,
    rgba(255, 84, 22, 1) 90%
  );
  color: white;
  position: relative;
  font-size: 20px;
}

.chat-box {
  padding: 0px;
  overflow-y: scroll;
  background-image: url(../../assets/dot-grid.png);
  background-repeat: repeat;
  border: 2px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(228, 0, 0, 1) 25%,
    rgba(255, 84, 22, 1) 90%
  );
  border-image-slice: 1;
}

.input-footer {
  padding: 0px;
  border: none;
  background-color: white;
}
.load-more-div {
  z-index: 1;
  position: absolute;
  width: 100%;
}

.load-more-btn {
  background-color: #dbdbdc;
}
</style>
