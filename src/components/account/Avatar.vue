<template>
  <div>
    <v-form>
      <v-text-field label="Avatar" v-model="imageName" @click="pickFile" prepend-icon="attach_file"></v-text-field>
      <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked">
      <v-progress-linear v-model="uploadPercentage" v-show="uploadPercentage != 0"></v-progress-linear>
      <v-btn color="info" @click="updateAvatar">Envoyer</v-btn>
    </v-form>
    <!-- <b-form @submit.prevent="updateAvatar">
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file..."
        drop-placeholder="Drop file here..."
        accept=".jpg, .png, .jpeg"
      ></b-form-file>
      <b-progress
        :max="max"
        variant="info"
        striped
        animated
        class="mt-2"
        v-if="uploadPercentage != 0"
      >
        <b-progress-bar :value="uploadPercentage">
          <strong>{{ uploadPercentage }} / {{ max }}</strong>
        </b-progress-bar>
      </b-progress>
      <b-button type="submit" variant="primary" class="mt-2">Envoyer</b-button>
    </b-form>-->
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
      imageName: "",
      file: null,
      uploadPercentage: 0,
      max: 100
    };
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        this.file = files[0];
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
      }
    },
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
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }.bind(this)
        })
        .then(() => {
          this.$store.dispatch("logout").then(() => this.$router.push("/"));
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
