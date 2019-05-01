<template>
  <v-container fluid grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex>
        <Info :user="user"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Info from "@/components/profile/Info";

export default {
  data() {
    return {
      user: {}
    };
  },
  components: {
    Info
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      axios.get("/users/" + this.$route.params.id).then(({ data }) => {
        this.user = data.user;
      });
    }
  }
};
</script>

<style>
</style>
