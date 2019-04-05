<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h1>Inscrivez-vous !</h1>
          <Alert
            :type="registerErrorType"
            :message="registerErrorMessage"
            v-if="registerErrorMessage"
          />
          <b-form @submit.prevent="register">
            <b-form-group label="Nom d'utilisateur">
              <b-form-input
                id="usernameInput"
                type="text"
                name="username"
                :value="registerUsername"
                @change="setRegisterUsername"
                aria-describedby="usernameInputFeedback"
                placeholder="Entrez votre nom d'utilisateur"
              />

              <b-form-invalid-feedback
                id="usernameInputFeedback"
              >Ceci est un champ obligatoire. Votre nom d'utilisateur doit au moins contenir 6 charactères.</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input
                id="emailInput"
                type="email"
                name="email"
                :value="registerEmail"
                @change="setRegisterEmail"
                aria-describedby="emailInputFeedback"
                placeholder="Entrez votre email"
              />
              <b-form-invalid-feedback id="emailInputFeedback">Ceci est un champ obligatoire.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Mot de Passe">
              <b-form-input
                id="passwordInput"
                type="password"
                name="password"
                :value="registerPassword"
                @change="setRegisterPassword"
                aria-describedby="passInputFeedback"
                placeholder="Entrez votre mot de passe"
              />
              <b-form-invalid-feedback
                id="passInputFeedback"
              >Ceci est un champ obligatoire. Votre mot de passe doit au moins contenir 6 charactères.</b-form-invalid-feedback>
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
  name: "Register",
  components: {
    Alert
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next("/") : next();
  },
  computed: {
    ...mapState("auth", [
      "registerUsername",
      "registerEmail",
      "registerPassword",
      "registerErrorMessage",
      "registerErrorType"
    ])
  },
  methods: {
    ...mapMutations("auth", [
      "setRegisterUsername",
      "setRegisterEmail",
      "setRegisterPassword"
    ]),
    ...mapActions("auth", ["register"])
  }
};
</script>
