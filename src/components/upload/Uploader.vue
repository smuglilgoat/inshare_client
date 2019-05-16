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
            <v-img :src="images[0].path" aspect-ratio="1" contain min-width="170px"></v-img>
          </v-flex>
          <v-flex grow>
            <v-text-field label="Titre" v-model="form.titre"></v-text-field>
            <v-textarea label="Description" v-model="form.description" flat></v-textarea>
          </v-flex>
          <v-flex grow>
            <v-text-field label="Domaine" v-model="form.domaine"></v-text-field>
            <v-select :items="langue" label="Langue" v-model="form.langue"></v-select>
            <v-select :items="categorie" label="Categorie" v-model="form.categorie"></v-select>
          </v-flex>
          <v-flex xs12>
            <tags-input
              element-id="tags"
              v-model="selectedTags"
              :existing-tags="existingTags"
              :typeahead="true"
            ></tags-input>
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
      selectedTags: [],
      existingTags: null,
      form: {
        titre: "",
        description: "",
        langue: "",
        categorie: "",
        domaine: ""
      },
      langue: ["Arabe", "Anglais", "Français"],
      categorie: [
        "Support_de_Cours",
        "Note_de_Cours",
        "Serie_de_TD",
        "Serie_de_TP",
        "Examination"
      ],
      document: {},
      images: null,
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
  created() {
    axios.get("/tags").then(({ data }) => {
      let tagList = "{ ";
      data.tags.forEach(tag => {
        tagList =
          tagList + '"' + tag.nom + '"' + ":" + '"' + tag.nom + '"' + ",";
      });
      tagList = tagList.slice(0, -1);
      tagList = tagList + "}";
      tagList = JSON.parse(tagList);
      this.existingTags = tagList;
    });
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
          this.document = x.data.document;
          axios
            .get("/documents/" + this.document.id + "/images")
            .then(data => (this.images = data.data.images.slice()));
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
        formData.append("file", fileList[index], fileList[index].name);
      }

      this.save(formData);
    },
    upload(formData) {
      const token = localStorage.getItem("token");
      return axios.post("/documents", formData, {
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
        .delete("/documents/doc=" + this.document.id, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => this.$router.push("/"));
    },
    update() {
      const token = localStorage.getItem("token");
      axios
        .put(
          "/documents/doc=" + this.document.id,
          {
            titre: this.form.titre,
            description: this.form.description,
            langue: this.form.langue,
            categorie: this.form.categorie,
            domaine: this.form.domaine,
            tags: this.selectedTags
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

/* The input */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tags-input input {
  flex: 1;
  background: transparent;
  border: none;
}

.tags-input input:focus {
  outline: none;
}

.tags-input input[type="text"] {
  color: #495057;
}

.tags-input-wrapper-default {
  padding: 0.5rem 0.25rem;

  background: #fff;

  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-color: #dbdbdb;
}

/* The tag badges & the remove icon */
.tags-input span {
  margin-right: 0.3rem;
}

.tags-input-remove {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
}

.tags-input-remove:before,
.tags-input-remove:after {
  content: "";
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  background: #5dc282;

  height: 2px;
  margin-top: -1px;
}

.tags-input-remove:before {
  transform: rotate(45deg);
}
.tags-input-remove:after {
  transform: rotate(-45deg);
}

/* Tag badge styles */
.tags-input-badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.tags-input-badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}

.tags-input-badge-selected-default {
  color: #212529;
  background-color: #f0f1f2;
}

/* Typeahead - badges */
.typeahead-badges > span {
  cursor: pointer;
  margin-right: 0.3rem;
}

/* Typeahead - dropdown */
.typeahead-dropdown {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
}

.typeahead-dropdown li {
  padding: 0.25rem 1rem;
  cursor: pointer;
}

/* Typeahead elements style/theme */
.tags-input-typeahead-item-default {
  color: #fff;
  background-color: #343a40;
}

.tags-input-typeahead-item-highlighted-default {
  color: #fff;
  background-color: #007bff;
}
</style>
