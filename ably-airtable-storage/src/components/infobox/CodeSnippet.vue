<template>
  <div class="code-sample-container">
    <span>
      <VueCodeHighlight language="javascript" class="code-sample">
        {{ jscode }}
      </VueCodeHighlight>
    </span>
  </div>
</template>

<script>
import { component as VueCodeHighlight } from "vue-code-highlight";
import "vue-code-highlight/themes/prism-tomorrow.css";
export default {
  name: "CodeSnippet",
  components: { VueCodeHighlight },
  props: ["whichCodeSnippet"],
  data() {
    return {
      jscode: null,
      ablyConnectionCodeSnippet: null,
      ablyPresenceCodeSnippet: null,
      ablyPubSubCodeSnippet: null,
      ablySubOnlyCodeSnippet: null,
      airTableCodeSnippet: null,
    };
  },
  methods: {
    updateCodeSnippet() {
      switch (this.whichCodeSnippet) {
        case "ably-connected":
          this.jscode = this.ablyConnectionCodeSnippet;
          break;
        case "ably-presence":
          this.jscode = this.ablyPresenceCodeSnippet;
          break;
        case "ably-pubsub":
          this.jscode = this.ablyPubSubCodeSnippet;
          break;
        case "ably-sub-only":
          this.jscode = this.ablySubOnlyCodeSnippet;
          break;
        case "airtable-db":
          this.jscode = this.airTableCodeSnippet;
          break;
      }
    },
  },
  created() {
    this.ablyConnectionCodeSnippet = `
    ablyRealtimeInstance = new Ably.Realtime({
      key: 'ablyAPIKey',
      clientId: 'uniqueId',
    });
    ablyRealtimeInstance.connection.on("connected", () => {
      chatChannelInstance = ablyRealtimeInstance.channels.get(
        '[?rewind=2m]chat-airtable'
      );
    });
    `;
    this.ablyPresenceCodeSnippet = `
    chatChannelInstance.subscribe((msg) => {
      handleNewMessage(msg);
    });
    chatChannelInstance.presence.enter(username);
    `;
    this.ablyPubSubCodeSnippet = `
    chatChannelInstance.subscribe("chat-msg", (msg) => {
      handleNewMessage(msg);
    });

    chatChannelInstance.publish("chat-msg", {
      records: msgPayload,
    });
    `;
    this.ablySubOnlyCodeSnippet = `
    chatChannelInstance.subscribe("chat-msg", (msg) => {
      handleNewMessage(msg);
    });
    `;
    this.airTableCodeSnippet = `
      airtableDBbase = new Airtable({ apiKey: 'apiKey' }).base('baseId');
      airtableDBbase("Table 1").select({
          maxRecords: 3,
          view: "Grid view",
          sort: [{ field: "ID", direction: "desc" }],
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(async function(record) {
            await chatMsgsArray.unshift({
              messageContent: record.fields,
              msgTimestamp: 123,
              msgType: "db",
            });
          });
          fetchNextPage();
        }
      );
    `;
    this.whichCodeSnippet = "ably-connected";
    this.updateCodeSnippet();
  },
  watch: {
    whichCodeSnippet: function() {
      this.updateCodeSnippet();
    },
  },
};
</script>

<style>
.code-sample-container {
  border: 1px #ffffff solid;
}
.code-sample {
  width: 100%;
  overflow: auto;
}
</style>
