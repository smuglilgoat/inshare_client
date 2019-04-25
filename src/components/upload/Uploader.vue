<template>
  <div>
    <!--FAILED-->
    <div v-if="isFailed" class="text-xs-center">
      <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
      <v-btn color="primary" @click="reset()">Réessayer</v-btn>
    </div>

    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
      <div class="dropbox">
        <input
          type="file"
          multiple
          :disabled="isSaving"
          @change="filesChange($event.target.files); fileCount = $event.target.files.length"
          accept="image/*"
          class="input-file"
        >
        <p v-if="isInitial">
          Glissez et déposez vos fichiers pour commencer
          <br>ou cliquez pour parcourir
        </p>
        <p v-if="isSaving">Envoie de {{ fileCount }} fichier(s)...</p>
        <v-progress-linear
          v-model="uploadPercentage"
          v-if="isSaving"
          class="ml-5"
          style="width: 90%"
        ></v-progress-linear>
      </div>
    </form>

    <!--SUCCESS-->
    <div v-if="isSuccess">
      <h2>Envoie de {{ uploadedFiles.length }} fichier(s) réussi.</h2>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/Alert";
import { log } from "util";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "Uploader",
  components: {
    Alert
  },
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadPercentage: 0,
      alert: {
        type: "",
        message: ""
      }
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.alert.type = null;
      this.alert.message = null;
    },
    save(formData) {
      this.currentStatus = STATUS_SAVING;

      this.upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.alert.type = "error";
          this.alert.message = err.response.data.message;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(fileList) {
      const formData = new FormData();

      if (!fileList.length) return;

      for (let index = 0; index < fileList.length; index++) {
        formData.append("file_" + index, fileList[index], fileList[index].name);
      }

      this.save(formData);
    },
    upload(formData) {
      const token = localStorage.getItem("token");
      return axios.post("create/document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: function(progressEvent) {
          this.uploadPercentage = parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        }.bind(this)
      });
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style lang="scss">
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: #ffffff; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
