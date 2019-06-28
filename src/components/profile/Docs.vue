<template>
  <v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editer</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="editedItem.titre" label="Titre"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="editedItem.description" label="Description"></v-textarea>
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
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" flat @click="updateDoc">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar card flat dense color="primary">
      <v-toolbar-title>Vos documents</v-toolbar-title>
    </v-toolbar>
    <v-card-text v-if="isInitial || isLoading">
      <v-layout fill-height align-center justify-center ma-0>
        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
      </v-layout>
    </v-card-text>

    <v-card-text v-if="isSuccess && docs.length == 0">
      <v-layout fill-height align-center justify-center ma-0>
        <i>Aucun document :'(</i>
      </v-layout>
    </v-card-text>
    <v-list two-line v-if="isSuccess && docs.length != 0">
      <v-list-tile avatar v-for="doc in docs" :key="doc.id" @click>
        <v-list-tile-avatar>
          <v-icon class="green lighten-1 white--text" v-if="doc.public == 1">check_circle</v-icon>
          <v-icon class="red lighten-1 white--text" v-else>schedule</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content @click="toDoc(doc.id)">
          <v-list-tile-title>{{doc.titre}}</v-list-tile-title>
          <v-list-tile-sub-title>{{doc.description}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon color="grey lighten-1" @click="editItem(doc)">edit</v-icon>
          </v-btn>
          <v-btn icon ripple @click="deleteUser(doc.id)">
            <v-icon color="grey lighten-1">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
const STATUS_INITIAL = 0,
  STATUS_LOADING = 1,
  STATUS_SUCCESS = 2;

export default {
  name: "Docs",
  data() {
    return {
      currentStatus: null,
      selectedTags: [],
      existingTags: null,
      docs: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        id: "",
        titre: "",
        description: "",
        tags: ""
      },
      defaultItem: {
        id: "",
        titre: "",
        description: "",
        tags: ""
      }
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  props: {
    user: {}
  },
  created() {
    this.currentStatus = STATUS_INITIAL;
    this.fetchDocuments();
    this.fetchTags();
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isLoading() {
      return this.currentStatus === STATUS_LOADING;
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.docs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.selectedTags = [];
      this.editedIndex = -1;
    },
    updateDoc() {
      if (this.editedIndex > -1) {
        const token = localStorage.getItem("token");

        axios
          .put(
            "/documents/doc=" + this.docs[this.editedIndex].id,
            {
              titre: this.editedItem.titre,
              description: this.editedItem.description,
              tags: this.selectedTags
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(() => {
            this.close();
            this.$router.go();
          });
      }
      this.close();
    },
    fetchDocuments() {
      this.currentStatus = STATUS_LOADING;

      axios
        .get("/documents/user=" + this.$store.getters.user.id)
        .then(({ data }) => (this.docs = data.docs));
    },
    toDoc(id) {
      this.$router.push("/documents/view/" + id);
    },
    deleteUser(id) {
      if (confirm("Est-vous sûr de vouloir supprimer ce document ?")) {
        axios.delete("/documents/doc=" + id).then(() => {
          this.$router.go();
        });
      }
    },
    fetchTags() {
      this.currentStatus = STATUS_LOADING;

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
        this.currentStatus = STATUS_SUCCESS;
      });
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
  color: #74777a;
}

.tags-input-wrapper-default {
  padding: 10px 10px 10px 5px;
  background: none;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #c6c6c6;
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
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 28px;
}

.tags-input-badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}

.tags-input-badge-selected-default {
  color: rgba(0, 0, 0, 0.87);
  background-color: #e0e0e0;
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
  background-color: #1565c0;
}
</style>
