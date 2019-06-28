<template>
  <div>
    <v-form>
      Entrez votre ancien et nouveau mot de passe.
      <v-text-field
        prepend-icon="lock"
        name="oldpassword"
        label="Mot de passe actuel"
        id="oldpassword"
        type="password"
        v-model="password"
      ></v-text-field>
      <v-text-field
        prepend-icon="lock"
        name="newpassword"
        label="Nouveau mot de passe"
        id="newpassword"
        type="password"
        v-model="newpassword"
      ></v-text-field>
      <v-flex text-xs-right>
        <v-btn color="primary" @click="updatePassword">Enregistrer</v-btn>
      </v-flex>
    </v-form>
    <Alert :type="alert.type" :message="alert.message" v-if="alert.message" class="mt-2"/>
  </div>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  name: "Password",
  components: {
    Alert
  },
  data() {
    return {
      alert: {
        message: "",
        type: ""
      },
      password: "",
      newpassword: ""
    };
  },
  methods: {
    updatePassword() {
      alert.type = "";
      alert.message = "";
      const token = localStorage.getItem("token");

      axios
        .put(
          "/users/" + this.$store.getters.user.id,
          {
            password: this.password,
            newpassword: this.newpassword
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          this.password = "";
          this.newpassword = "";
          this.$store.dispatch("logout").then(() => this.$router.push("/"));
        })
        .catch(error => {
          this.password = "";
          this.newpassword = "";
          this.alert = Object.assign({}, this.alert, {
            message: error.response.data.message,
            type: "danger"
          });
        });
    }
  }
};
</script>

<style>
</style>
