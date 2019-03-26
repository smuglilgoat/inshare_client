<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h1>Inscrivez-vous !</h1>
          <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
          <b-form @submit.prevent="inscription">
            <b-form-group label="Nom d'utilisateur">
              <b-form-input
                id="usernameInput"
                type="text"
                name="username"
                v-model="user.username"
                v-validate="{ required: true}"
                :state="(submitted && errors.has('username')) ? 'invalid' : 'null'"
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
                v-model="user.email"
                v-validate="{ required: true, email: true }"
                :state="(submitted && errors.has('email')) ? 'invalid' : 'null'"
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
                v-model="user.password"
                v-validate="{ required: true, min: 6 }"
                :state="(submitted && errors.has('password')) ? 'invalid' : 'null'"
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

export default {
  name: "Inscription",
  components: {
    Alert
  },
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: ""
      },
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
    inscription() {
      // Form submit logic
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          axios
            .post("/auth/inscription", {
              username: this.user.username,
              email: this.user.email,
              password: this.user.password
            })
            .then(response => {
              // save token in localstorage
              localStorage.setItem("authToken", response.data.data.token);

              // redirect to user home
              this.$router.push("/");
            })
            .catch(error => {
              localStorage.removeItem("authToken");
              // display error notification
              this.alert = Object.assign({}, this.alert, {
                message: error.response.data.message,
                type: error.response.data.status
              });
            });
        }
      });
    }
  }
};
</script>
