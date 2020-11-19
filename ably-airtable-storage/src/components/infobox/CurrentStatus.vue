<template>
  <div class="card command-info">
    <div class="card-body current-status">
      <p><strong>Current Status: </strong>{{ backgroundInfoText }}</p>
      <a :href="infoLinkHref" target="_blank">
        {{ infoLinkText }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "CurrentStatus",
  props: ["backgroundInfoText", "infoLinkText", "infoLinkHref"],
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
