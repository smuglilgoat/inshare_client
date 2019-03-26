<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-2">
      <b-navbar-brand to="/">
        <i class="fas fa-home"></i>
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse"/>

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/auth/inscription" v-if="!isConnected">Inscription</b-nav-item>
          <b-nav-item to="/auth/connexion" v-if="!isConnected">Connexion</b-nav-item>
          <b-nav-item @click="logout" v-if="isConnected">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Navrbar",
  data() {
    return {
      token: ""
    };
  },
  watch: {
    token(newToken) {
      this.token = localStorage.authToken ? localStorage.authToken : "";
    }
  },
  mounted() {
    if (localStorage.authToken) {
      this.token = localStorage.authToken;
    }
  },
  computed: {
    isConnected() {
      return !this.token == "";
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>
