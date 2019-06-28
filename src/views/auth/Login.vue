<template>
  <v-container grid-list-xs fluid fill-height text-xs-center>
    <v-layout align-center row warp justify-center>
      <v-flex xs12 sm8 md4>
        <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" flat>
            <v-toolbar-title>Connectez-vous !</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="email"
                label="Email"
                type="email"
                v-model="email"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Mot de Passe"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="info" to="/auth/register">S'inscrire</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Suivant</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
  name: "Login",
  components: {
    Alert
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next("/") : next();
  },
  data: () => ({
    alert: {
      message: "",
      type: ""
    },
    email: "",
    password: ""
  }),
  methods: {
    login() {
      this.alert.message = "";
      this.alert.type = "";
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("login", { email, password })
        .then(() => this.$router.push("/"))
        .catch(err => {
          console.log(err);
          this.alert.message = "Une erreur s'est produite";
          this.alert.type = "error";
        });
    }
  }
};
</script>
