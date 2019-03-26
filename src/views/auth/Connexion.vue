<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h1>Connectez-vous !</h1>
          <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
          <b-form @submit.prevent="login">
            <b-form-group label="Email">
              <b-form-input
                id="emailInput"
                type="email"
                name="email"
                v-model="email"
                placeholder="Entrez votre email"
              />
            </b-form-group>
            <b-form-group label="Mot de Passe">
              <b-form-input
                id="passwordInput"
                type="password"
                name="password"
                v-model="password"
                placeholder="Entrez votre mot de passe"
              />
            </b-form-group>
            <b-button type="submit" variant="primary">Envoyer</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
  name: "Connexion",
  components: {
    Alert
  },
  data() {
    return {
      email: "",
      password: "",
      alert: {
        message: "",
        type: ""
      },
      submitted: false
    };
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("authToken");

    return token ? next("/") : next();
  },
  methods: {
    login() {
      axios
        .post("/auth/connexion", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          // save token in localstorage
          localStorage.setItem("authToken", response.data.data.token);

          // redirect to user home
          this.$router.push("/");
        })
        .catch(error => {
          // clear form inputs
          this.email = this.password = "";

          // display error notification
          this.alert = Object.assign({}, this.alert, {
            message: error.response.data.message,
            type: error.response.data.status
          });
        });
    }
  }
};
</script>
