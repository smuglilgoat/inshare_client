<template>
  <div>
    <b-form @submit.prevent="updateUsername">
      <b-form-group label="Nom d'Utilisateur">
        <b-form-input
          id="usernameInput"
          type="text"
          name="username"
          v-model="user.username"
          placeholder="Entrez votre nouveau nom d'utilisateur"
        />
      </b-form-group>

      <b-button type="submit" variant="primary">Envoyer</b-button>
    </b-form>
    <hr>
    <b-form @submit.prevent="updateEmail">
      <b-form-group label="Email">
        <b-form-input
          id="emailInput"
          type="email"
          name="email"
          v-model="user.email"
          placeholder="Entrez votre nouveau email"
        />
      </b-form-group>

      <b-button type="submit" variant="primary">Envoyer</b-button>
    </b-form>
    <Alert :type="alert.type" :message="alert.message" v-if="alert.message" class="mt-2"/>
  </div>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  name: "ModifInfo",
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
          "/compte/majinfo",
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
          this.$router.push("/");
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
          "/compte/majinfo",
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
          this.$router.push("/");
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
