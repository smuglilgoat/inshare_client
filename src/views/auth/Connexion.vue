<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h1>Connectez-vous !</h1>
          <Alert :type="loginErrorType" :message="loginErrorMessage" v-if="loginErrorMessage"/>
          <b-form @submit.prevent="login">
            <b-form-group label="Email">
              <b-form-input
                id="emailInput"
                type="email"
                name="email"
                :value="loginEmail"
                @input="setLoginEmail"
                placeholder="Entrez votre email"
              />
            </b-form-group>
            <b-form-group label="Mot de Passe">
              <b-form-input
                id="passwordInput"
                type="password"
                name="password"
                :value="loginPassword"
                @input="setLoginPassword"
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
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Connexion",
  components: {
    Alert
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next("/") : next();
  },
  computed: {
    ...mapState("auth", [
      "loginEmail",
      "loginPassword",
      "loginErrorMessage",
      "loginErrorType"
    ])
  },
  methods: {
    ...mapMutations("auth", [
      "setLoginUsername",
      "setLoginEmail",
      "setLoginPassword"
    ]),
    ...mapActions("auth", ["login"])
  }
};
</script>
