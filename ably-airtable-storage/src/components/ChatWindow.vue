<template>
  <div class="chat-window-container">
    <div class="card">
      <div class="card-header chat-header">
        Ably Group Chat
      </div>

      <div class="card-body chat-box" ref="chatMsgsBox">
        <Username
          v-if="!isReadyToChat"
          :saveUsernameAndJoin="saveUsernameAndJoin"
        ></Username>
        <template v-if="isReadyToChat">
          <div v-if="showLoadMoreBtn" class="load-more-div">
            <button
              type="button"
              class="btn btn-primary"
              @click="getDataFromDB"
            >
              Load previous messages <span class="badge badge-light">↑</span>
            </button>
          </div>
          <ChatMessage
            v-for="message in chatMsgsArray"
            :key="message.timeStamp"
            :message="message"
            :myClientId="myClientId"
          ></ChatMessage
        ></template>
      </div>
      <ChatInputBox
        v-if="isReadyToChat"
        :chatChannelInstance="chatChannelInstance"
        :clientUsername="clientUsername"
        :myClientId="myClientId"
      ></ChatInputBox>
    </div>
    <!-- <button @click="getDataFromDB">GET STUFF FROM DB</button> -->
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage.vue";
import ChatInputBox from "./ChatInputBox.vue";
import Username from "./Username.vue";
import * as Airtable from "airtable";

export default {
  name: "ChatWindow",
  props: ["chatChannelInstance", "myClientId"],
  components: {
    ChatMessage,
    ChatInputBox,
    Username,
  },
  data() {
    return {
      chatMsgsArray: [],
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
    },
    handleNewMessage(msg) {
      let messageContent = msg.data.records[0].fields;
      let msgTimestamp = msg.timestamp;
      let divScrollHeight = this.$refs.chatMsgsBox.scrollHeight;
      this.chatMsgsArray.push({
        messageContent,
        msgTimestamp,
      });
      this.$refs.chatMsgsBox.scrollTop = divScrollHeight;
    },
    getDataFromDB() {
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
              console.log("Retrieved", record.get("ID"));
              vueContext.dbAutoNumber = record.get("ID");
              vueContext.makeNewReq();
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
    makeNewReq() {
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
            records.forEach(function(record) {
              console.log("Retrieved", record.fields);
              vueContext.chatMsgsArray.unshift({
                messageContent: record.fields,
                msgTimestamp: record.fields["create-time"],
              });
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
      for (let i = 0; i < this.chatMsgsArray.length; i++) {
        console.log(this.chatMsgsArray[i].messageContent["chat-message"]);
      }
    });
  },
};
</script>

<style>
.chat-window-container {
  min-width: 40%;
  max-width: 40%;
}

.chat-header {
  background-color: #5a6268;
  color: white;
  position: relative;
}

.chat-box {
  padding: 0px;
  min-height: 600px;
  max-height: 600px;
  overflow-y: scroll;
  background-image: url(../assets/dot-grid.png);
  background-repeat: repeat;
}

.load-more-div {
  z-index: 1;
  position: absolute;
  width: 100%;
  /* left: 40%; */
}

.chat-input {
  background-color: #f7f7f7;
  border: #6c757d 1px solid;
}

.chat-input:focus {
  background-color: #f7f7f7;
  border: #6c757d 1px solid;
}
</style>
