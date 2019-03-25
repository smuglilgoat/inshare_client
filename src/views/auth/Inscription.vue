<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h1>Inscrivez-vous !</h1>
          <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
          <b-form @submit.prevent="onSubmit">
            <b-form-group id="inputUsername" label="Nom d'utilisateur" label-for="usernameInput">
              <b-form-input
                id="usernameInput"
                type="text"
                v-model="form.username"
                v-validate="{ required: true, min:6 }"
                :state="validateState('form.username')"
                aria-describedby="usernameInputFeedback"
                placeholder="Entrez votre nom d'utilisateur"
              />

              <b-form-invalid-feedback
                id="usernameInputFeedback"
              >Ceci est un champ obligatoire. Votre not d'utilisateur doit au moins contenir 6 charactères.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="inputEmail" label="Email" label-for="emailInput">
              <b-form-input
                id="emailInput"
                type="email"
                v-model="form.email"
                v-validate="{ required: true }"
                :state="validateState('form.email')"
                aria-describedby="emailInputFeedback"
                placeholder="Entrez votre email"
              />

              <b-form-invalid-feedback id="emailInputFeedback">Ceci est un champ obligatoire.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="inputPass" label="Mot de Passe" label-for="passInput">
              <b-form-input
                id="passInput"
                type="password"
                v-model="form.password"
                v-validate="{ required: true, min:6 }"
                :state="validateState('form.password')"
                aria-describedby="passInputFeedback"
                placeholder="Entrez votre mot de passe"
              />

              <b-form-invalid-feedback
                id="passInputFeedback"
              >Ceci est un champ obligatoire. Votre mot de passe doit au moins contenir 6 charactères.</b-form-invalid-feedback>
            </b-form-group>

            <b-button type="submit" variant="primary" :disabled="errors.any()">Envoyer</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
  name: "Inscription",
  components: {
    Alert
  },
  data() {
    return {
      form: {},
      alert: {
        message: "",
        type: ""
      }
    };
  },
  methods: {
    onSubmit() {
      // Form submit logic
    },
    validateState(ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    }
  }
};
</script>
