<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-layout row wrap align-center justify-center>
        <v-flex xs10>
          <v-tabs centered color="primary" dark icons-and-text grow>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab key="1">
              Informations
              <v-icon>edit</v-icon>
            </v-tab>

            <v-tab-item key="1">
              <v-card flat>
                <v-card-text>
                  <Info/>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab key="2">
              Mot de Passe
              <v-icon>lock</v-icon>
            </v-tab>
            <v-tab-item key="2">
              <v-card flat>
                <v-card-text>
                  <Password/>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab key="3">
              Avatar
              <v-icon>photo</v-icon>
            </v-tab>
            <v-tab-item key="3">
              <v-card flat>
                <v-card-text>
                  <Avatar/>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Info from "@/components/account/Info";
import Password from "@/components/account/Password";
import Avatar from "@/components/account/Avatar";

export default {
  components: {
    Info,
    Password,
    Avatar
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next() : next("/auth/login");
  }
};
</script>

<style>
</style>
