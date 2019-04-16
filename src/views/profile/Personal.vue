<template>
  <v-container fluid grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex>
        <Info :user="user"/>
      </v-flex>
      <v-flex>
        <Role :user="user"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Info from "@/components/profile/Info";
import Role from "@/components/profile/Role";

export default {
  data() {
    return {
      user: {}
    };
  },
  components: {
    Info,
    Role
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next() : next("/auth/login");
  },
  mounted() {
    this.user = this.$store.getters.user;
    // this.fetchAuthenticatedUser();
  },
  methods: {
    fetchAuthenticatedUser() {
      const token = localStorage.getItem("token");

      axios
        .get("/read/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          this.user = data;
        });
    }
  }
};
</script>

<style>
</style>
