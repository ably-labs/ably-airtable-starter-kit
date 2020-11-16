<template>
  <div class="card username-input">
    <div class="card-body">
      <div class="input-group ">
        <input
          type="text"
          class="form-control"
          placeholder="Username"
          aria-label="Username"
          aria-describedby="button-addon2"
          v-model="username"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            @click="saveUsernameAndJoin(username)"
          >
            Join chat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Username",
  props: ["saveUsernameAndJoin"],
  data() {
    return {
      username: "",
    };
  },
};
</script>

<style>
.username-input {
  margin: 200px auto 0px auto;
  width: 80%;
  text-align: center;
}
</style>
