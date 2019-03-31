<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="8">
          <InfoProfile :user="user"/>
        </b-col>
        <b-col cols="4" v-if="user.role == 'Simple'">
          <DemandeRole :user="user"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import InfoProfile from "@/components/InfoProfile";
import DemandeRole from "@/components/DemandeRole";

export default {
  data() {
    return {
      user: {}
    };
  },
  components: {
    InfoProfile,
    DemandeRole
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
        .get("/profile/moi", {
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
