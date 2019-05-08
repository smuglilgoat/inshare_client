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
              <v-flex xs12 >
                <v-text-field v-model="editedItem.titre" label="Titre"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="editedItem.description" label="Description"></v-textarea>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="editedItem.tags" label="Tags"></v-textarea>
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
    <v-list two-line>
      <v-list-tile avatar v-for="doc in docs" :key="doc.id" @click>
        <v-list-tile-avatar>
          <v-icon class="green lighten-1 white--text" v-if="doc.public == 1">check_circle</v-icon>
          <v-icon class="red lighten-1 white--text" v-else>cancel</v-icon>
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
export default {
  name: "Docs",
  data() {
    return {
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
    this.fetchDocuments();
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
              tags: this.editedItem.tags
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
    }
  }
};
</script>

<style>
</style>
