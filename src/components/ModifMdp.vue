<template>
  <div>
    <b-form @submit.prevent="updatePassword">
      <b-form-group label="Mot de passe actuel">
        <b-form-input
          id="passwordInput"
          type="password"
          name="password"
          v-model="password"
          placeholder="Entrez votre mot de passe"
        />
      </b-form-group>

      <b-form-group label="Nouveau mot de passe">
        <b-form-input
          id="newpasswordInput"
          type="password"
          name="newpassword"
          v-model="newpassword"
          placeholder="Entrez votre nouveau mot de passe"
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
  name: "ModifMdp",
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
          "/compte/majmdp",
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
          this.$router.push("/");
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
