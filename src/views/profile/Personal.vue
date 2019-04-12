<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="8">
          <Info :user="user"/>
        </b-col>
        <b-col cols="4" v-if="user.role == 'Simple'">
          <Role :user="user"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
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
    this.fetchAuthenticatedUser();
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
