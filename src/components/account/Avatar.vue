<template>
  <div>
    <b-form @submit.prevent="updateAvatar">
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file..."
        drop-placeholder="Drop file here..."
        accept=".jpg, .png, .jpeg"
      ></b-form-file>
      <b-button type="submit" variant="primary" class="mt-2">Envoyer</b-button>
    </b-form>
    <Alert :type="alert.type" :message="alert.message" v-if="alert.message" class="mt-2"/>
  </div>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  name: "Avatar",
  components: {
    Alert
  },
  data() {
    return {
      alert: {
        message: "",
        type: ""
      },
      file: null
    };
  },
  methods: {
    updateAvatar() {
      alert.type = "";
      alert.message = "";
      const token = localStorage.getItem("token");

      let formData = new FormData();

      formData.append("file", this.file);
      axios
        .post("/update/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
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
