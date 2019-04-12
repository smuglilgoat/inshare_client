<template>
  <div>
    <b-card no-body class="ml-2 mr-2">
      <b-tabs card>
        <b-tab title="Certificats" active>
          <b-card-text>
            <Certificats/>
          </b-card-text>
        </b-tab>
        <b-tab title="Utilisateurs">
          <b-card-text>
            <Users/>
          </b-card-text>
        </b-tab>
        <b-tab title="Documents">
          <b-card-text></b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Certificats from "@/components/admin/Certificats";
import Users from "@/components/admin/Users";

export default {
  components: {
    Certificats,
    Users
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/read/user", {
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
