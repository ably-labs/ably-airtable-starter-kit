<template>
  <div class="card command-info">
    <div class="card-body current-status">
      <p><strong>Current Status: </strong>{{ backgroundInfoText }}</p>
      <a :href="infoLinkHref" target="_blank">
        {{ infoLinkText }}
      </a>
      <template v-if="showSecondLink"
        >or
        <a
          href="https://airtable.com/shrBExmY1lK3yyupo/tble6R4YjCEuP8A7x"
          target="_blank"
        >
          see the database schema for this app
        </a></template
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "CurrentStatusText",
  props: [
    "backgroundInfoText",
    "infoLinkText",
    "infoLinkHref",
    "showSecondLink",
  ],
  data() {
    return {};
  },
  created() {},
};
</script>

<style>
.command-info {
  width: 100%;
  text-align: left;
  border: none;
  background-color: #f5f2f0;
  border: 1px #ffffff solid;
}
</style>
