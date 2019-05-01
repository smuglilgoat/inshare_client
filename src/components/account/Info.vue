<template>
  <div>
    <v-form>
      <v-text-field
        name="username"
        label="Nom d'utilisateur"
        id="username"
        prepend-icon="person"
        v-model="user.username"
      ></v-text-field>
      <v-btn color="primary" @click="updateUsername">Envoyer</v-btn>
      <v-divider></v-divider>
      <v-text-field name="email" label="Email" id="email" prepend-icon="email" v-model="user.email"></v-text-field>
      <v-btn color="primary" @click="updateEmail">Envoyer</v-btn>
    </v-form>
    <Alert :type="alert.type" :message="alert.message" v-if="alert.message" class="mt-2"/>
  </div>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  name: "Info",
  components: {
    Alert
  },
  data() {
    return {
      alert: {
        message: "",
        type: ""
      },
      user: {
        username: "",
        email: ""
      }
    };
  },
  methods: {
    updateUsername() {
      alert.type = "";
      alert.message = "";
      const token = localStorage.getItem("token");

      axios
        .put(
          "/users/" + this.$store.getters.user.id,
          {
            username: this.user.username
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          this.user.username = "";
          this.user.email = "";
          this.$store.dispatch("logout").then(() => this.$router.push("/"));
        })
        .catch(error => {
          this.user.username = "";
          this.user.email = "";
          this.alert = Object.assign({}, this.alert, {
            message: error.response.data.message,
            type: "danger"
          });
        });
    },
    updateEmail() {
      alert.type = "";
      alert.message = "";
      const token = localStorage.getItem("token");

      axios
        .put(
          "/users/" + this.$store.getters.user.id,
          {
            email: this.user.email
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          this.user.username = "";
          this.user.email = "";
          this.$store.dispatch("logout").then(() => this.$router.push("/"));
        })
        .catch(error => {
          this.user.username = "";
          this.user.email = "";
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
