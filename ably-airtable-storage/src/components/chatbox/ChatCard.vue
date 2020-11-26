<template>
  <div class="chat-window-container">
    <div class="card chat-card">
      <div class="card-header chat-header">
        <div class="header-data">
          Group Chat Demo - Ably | Airtable
        </div>
        <!-- <div class="header-data presence-stats">
          <p class="online-circle"></p>
          2 people online
        </div> -->
      </div>
      <div class="card-body chat-box " ref="chatMsgsBox">
        <UsernameInput
          v-if="!isReadyToChat"
          :saveUsernameAndJoin="saveUsernameAndJoin"
        ></UsernameInput>
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
        <ChatInput
          v-if="isReadyToChat"
          :chatChannelInstance="chatChannelInstance"
          :clientUsername="clientUsername"
          :myClientId="myClientId"
        ></ChatInput>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import UsernameInput from "./UsernameInput.vue";
import * as Airtable from "airtable";
import { backgroundEventBus } from "../../main.js";
import * as configVars from "../../../config.js";

export default {
  name: "ChatCard",
  props: [
    "chatChannelInstance",
    "myClientId",
    "updateBackgroundStatus",
    "chatMsgsArray",
  ],
  components: {
    ChatMessage,
    ChatInput,
    UsernameInput,
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
      if (messageContent.clientId != this.myClientId && this.isReadyToChat) {
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
    },
    getMsgsFromDBWithMsgID() {
      this.latestMsgId = this.chatMsgsArray[0].messageContent.msgId;
      this.showLoadMoreBtn = false;
      setTimeout(() => {
        this.showLoadMoreBtn = true;
      }, 2000);
      this.base = new Airtable({
        apiKey: configVars.AIRTABLE_API_KEY,
      }).base(configVars.AIRTABLE_BASE_ID);
      let vueContext = this;

      this.base("Table 1")
        .select({
          view: "Grid view",
          filterByFormula: "SEARCH('" + vueContext.latestMsgId + "',{msgId})",
        })
        .eachPage(function page(records, fetchNextPage) {
          const latestRecordID = records[0].fields.ID;
          vueContext.dbAutoNumber = latestRecordID;
          if (latestRecordID) {
            vueContext.getMsgsFromDBWithAutoID();
          } else {
            fetchNextPage();
          }
        });
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
              backgroundEventBus.$emit(
                "updateBackgroundEventStatus",
                "db-msgs-loaded"
              );
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
      this.base = new Airtable({
        apiKey: configVars.AIRTABLE_API_KEY,
      }).base(configVars.AIRTABLE_BASE_ID);
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
              backgroundEventBus.$emit(
                "updateBackgroundEventStatus",
                "db-msgs-loaded"
              );
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
  min-height: 90vh;
  max-height: 90vh;
}
.chat-header {
  border: none;
  background-color: #292831;
  color: white;
  position: relative;
  font-size: 20px;
  display: flex;
  justify-content: space-around;
}

.header-data {
  margin: 0px;
}

.chat-box {
  padding: 0px;
  overflow-y: scroll;
  background-image: url(../../assets/psychedelic_pattern.png);
  background-repeat: repeat;
  border: none;
}

.presence-stats {
  display: flex;
}
.online-circle {
  background: #03940a;
  border-radius: 50%;
  width: 0.8rem;
  height: 0.8rem;
  margin: auto 0.5rem;
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
