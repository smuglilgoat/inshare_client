<template>
  <div>
    <h1>Admin Dashboard</h1>
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          if (data.role != "Administrateur" && data.role != "Moderateur") {
            return next("/");
          } else {
            return next();
          }
        });
    } else {
      return next("/auth/login");
    }
  }
};
</script>

<style>
</style>
