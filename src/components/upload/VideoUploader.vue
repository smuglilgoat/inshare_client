<template>
  <div>
    <!--FAILED-->
    <div v-if="isFailed" class="text-xs-center">
      <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
      <v-btn color="primary" @click="reset()">Réessayer</v-btn>
    </div>

    <!--INITIAL-->
    <div v-if="isInitial">
      <v-card>
        <v-toolbar card flat dense color="primary">
          <v-toolbar-title>Entrez le lien de la vidéo...</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-xs>
          <v-layout row wrap>
            <v-flex xs12>
              <v-select
                :items="hebergeurs"
                v-model="form.hebergeur"
                label="Hebergeur"
                :disabled="isSaving"
              ></v-select>
              <v-text-field v-model="form.lien" label="Lien" :disabled="isSaving"></v-text-field>
            </v-flex>
            <v-flex text-xs-right>
              <v-btn color="primary" :loading="loading" :disabled="loading" @click="save()">Envoyer</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </div>

    <!--SUCCESS-->
    <v-card v-if="isSuccess || isSaving">
      <v-toolbar card flat dense color="primary">
        <v-toolbar-title>Envoie du document...</v-toolbar-title>
      </v-toolbar>
      <v-container fluid fill-height>
        <v-layout row wrap align-center>
          <v-flex xs12>
            <div class="embed-container">
              <iframe
                :src="'https://www.youtube.com/embed/' + link"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
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

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "VideoUploader",
  components: {
    Alert
  },
  data() {
    return {
      loading: false,
      hebergeurs: ["YouTube"],
      selectedTags: [],
      existingTags: null,
      form: {
        hebergeur: "",
        lien: "",
        titre: "",
        description: "",
        langue: "",
        categorie: "",
        domaine: ""
      },
      langue: ["Arabe", "Anglais", "Français"],
      categorie: [
        { text: "Support de Cours", value: "Support_de_Cours" },
        { text: "Note de Cours", value: "Note_de_Cours" },
        { text: "Serie de TD", value: "Serie_de_TD" },
        { text: "Serie de TP", value: "Serie_de_TP" },
        { text: "Examination", value: "Examination" }
      ],
      document: {},
      link: "",
      currentStatus: null,
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
      this.reset();
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
      this.alert.type = null;
      this.alert.message = null;
    },
    save() {
      this.loading = true;
      this.currentStatus = STATUS_SAVING;

      this.upload()
        .then(x => {
          this.document = x.data.document;
          axios
            .get("/documents/" + this.document.id + "/video")
            .then(data => (this.link = data.data.video.link));
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.alert.type = "error";
          this.alert.message = err.response.data.message;
          this.currentStatus = STATUS_FAILED;
        });
    },
    upload() {
      const token = localStorage.getItem("token");
      return axios.post(
        "/documents/create/t=video",
        { provider: this.form.hebergeur, link: this.form.lien },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
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
  }
};
</script>

<style>
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

.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
