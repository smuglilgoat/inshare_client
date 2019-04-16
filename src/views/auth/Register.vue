<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Inscrivez-vous !</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  name="username"
                  label="Nom d'utilisateur"
                  type="text"
                  v-model="username"
                ></v-text-field>
                <v-text-field
                  prepend-icon="alternate_email"
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
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="register">Suivant</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
  name: "Register",
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
    username: "",
    email: "",
    password: ""
  }),
  methods: {
    register() {
      this.alert.message = "";
      this.alert.type = "";
      let username = this.username;
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("register", { username, email, password })
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
