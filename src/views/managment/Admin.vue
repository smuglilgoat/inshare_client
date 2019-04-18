<template>
  <div>
    <v-tabs centered color="primary" dark icons-and-text grow>
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab key="2">
        Utilisateurs
        <v-icon>assignment_ind</v-icon>
      </v-tab>
      <v-tab-item key="2">
        <v-card flat>
          <v-card-text>
            <Users/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      
      <v-tab key="1">
        Certificats
        <v-icon>card_membership</v-icon>
      </v-tab>
      <v-tab-item key="1">
        <v-card flat>
          <v-card-text>
            <Certificats/>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab key="3">
        Documents
        <v-icon>insert_drive_file</v-icon>
      </v-tab>
      <v-tab-item key="3">
        <v-card flat>
          <v-card-text></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
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
