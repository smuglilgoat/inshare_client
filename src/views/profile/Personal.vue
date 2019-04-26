<template>
  <v-container fluid grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex>
        <Info :user="user"/>
      </v-flex>
      <v-flex v-if="!isAdmin">
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
  created() {
    this.user = this.$store.getters.user;
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  }
};
</script>

<style>
</style>
