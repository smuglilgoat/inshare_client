<template>
  <div>
    <!--FAILED-->
    <div v-if="isFailed" class="text-xs-center">
      <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
      <v-btn color="primary" @click="reset()">Réessayer</v-btn>
    </div>

    <form enctype="multipart/form-data" novalidate v-if="isInitial">
      <div class="dropbox">
        <input
          type="file"
          multiple
          :disabled="isSaving"
          @change="filesChange($event.target.files)"
          accept="image/*"
          class="input-file"
        >
        <p>
          Glissez et déposez vos fichiers pour commencer
          <br>ou cliquez pour parcourir
        </p>
      </div>
    </form>

    <!--SUCCESS-->
    <v-card v-if="isSuccess || isSaving">
      <v-toolbar card flat dense color="primary">
        <v-toolbar-title>Envoie du document...</v-toolbar-title>
      </v-toolbar>
      <v-container fluid fill-height>
        <v-layout row wrap align-center>
          <v-flex md3 lg2 xl1>
            <v-img :src="document.link" aspect-ratio="1" contain min-width="170px"></v-img>
          </v-flex>
          <v-flex grow>
            <v-text-field label="Titre" v-model="form.titre"></v-text-field>
            <v-textarea label="Description" v-model="form.description" flat></v-textarea>
          </v-flex>
          <v-flex grow>
            <v-text-field label="Domaine" v-model="form.domaine"></v-text-field>
            <v-select :items="langue" label="Langue" v-model="form.langue"></v-select>
            <v-select :items="type" label="Type" v-model="form.type"></v-select>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid grid-list-xs fill-height text-xs-right>
        <v-layout row wrap>
          <v-flex xs12>
            <v-progress-linear v-model="uploadPercentage" v-if="!isSuccess"></v-progress-linear>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-btn color="error" @click="cancel" :disabled="!isSuccess">Annuler</v-btn>
            <v-btn color="success" @click="update" :disabled="!isSuccess">Envoyer</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
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
      form: {
        titre: "",
        description: "",
        langue: "",
        type: "",
        domaine: ""
      },
      langue: ["Arabe", "Anglais", "Français"],
      type: [
        "Support de Cours",
        "Note de Cours",
        "Série de TD",
        "Série de TP",
        "Examination"
      ],
      document: {},
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
          this.document = x.data;
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
    },
    cancel() {
      const token = localStorage.getItem("token");
      axios
        .delete(
          "delete/document",
          {
            data: {
              id: this.document.id
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => this.$router.push("/"));
    },
    update() {
      const token = localStorage.getItem("token");
      axios
        .put(
          "update/document",
          {
            id: this.document.id,
            titre: this.form.titre,
            description: this.form.description,
            langue: this.form.langue,
            type: this.form.type,
            domaine: this.form.domaine
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => this.$router.push("/"));
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

@media screen and (max-width: 840px) {
  .stupidflex {
    margin-left: 7%;
  }
}
</style>
