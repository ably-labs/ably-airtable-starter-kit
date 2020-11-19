<template>
  <div class="card username-input-div">
    <div class="card-body">
      <div class="input-group ">
        <input
          type="text"
          class="form-control usn-input"
          placeholder="Username"
          aria-label="Username"
          aria-describedby="button-addon2"
          @keyup.enter="saveUsernameAndJoin(username)"
          v-model="username"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary usn-save-btn"
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
.username-input-div {
  margin: 200px auto 0px auto;
  width: 80%;
  text-align: center;
  border-color: #292831;
}

.usn-input {
  border-color: #292831;
}

.usn-save-btn {
  background-color: #292831;
  color: #f5f5f6;
}
.usn-save-btn:hover {
  background-color: #f5f5f6;
  color: #292831;
}

.usn-save-btn:active {
  background-color: #76767c;
  color: #f5f5f6;
}
</style>
