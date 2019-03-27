<template>
  <div>
    <h1>Profile</h1>
    <h2>Bienvenu {{username}}</h2>
    <p>Email: {{email}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next() : next("/auth/connexion");
  },
  created() {
    this.fetchAuthenticatedUser();
  },
  methods: {
    fetchAuthenticatedUser() {
      const token = localStorage.getItem("token");

      axios
        .get("/compte/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          this.username = data.username;
          this.email = data.email;
        });
    }
  }
};
</script>

<style>
</style>
