<template>
  <v-card fluid flat>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editer</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.id" label="ID" readonly></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.user_id" label="Utilisateur" readonly></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.titre" label="Titre"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-checkbox v-model="editedItem.public" label="Public"></v-checkbox>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="editedItem.description" label="Description"></v-textarea>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select :items="langue" label="Langue" v-model="editedItem.langue"></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.domaine" label="Domaine"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.type" label="Type" readonly></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="editedItem.tags" label="Tags"></v-textarea>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.evaluation" label="Evaluation" readonly></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.vues" label="Visionnement" readonly></v-text-field>
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

    <v-data-table
      :headers="headers"
      :items="documents"
      :loading="loading"
      :search="search"
      class="elevation-1"
    >
      <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">{{ users.get(props.item.user_id) }}</td>
        <td class="text-xs-left">
          <router-link
            :to="{ name: 'document', params: { id: props.item.id }}"
          >{{ props.item.titre }}</router-link>
        </td>
        <td class="text-xs-left">
          <v-chip color="success" v-if="props.item.public != 0">Oui</v-chip>
          <v-chip color="error" v-else>Non</v-chip>
        </td>
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.domaine }}</td>
        <td class="text-xs-left">{{ props.item.tags }}</td>
        <td class="text-xs-left">{{ props.item.evaluation }}</td>
        <td class="text-xs-left">{{ props.item.vues }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteUser(props.item)">delete</v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <Alert :type="alert.type" :message="alert.message" v-if="alert.message"/>
      </template>
      <template
        v-slot:pageText="props"
      >Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
    </v-data-table>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Recherche"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
  </v-card>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
  name: "Documents",
  components: {
    Alert
  },
  data() {
    return {
      alert: {
        message: "",
        type: ""
      },
      search: "",
      dialog: false,
      loading: true,
      documents: [],
      users: new Map(),
      headers: [
        { text: "ID", align: "left", value: "id" },
        { text: "Utilisateur", value: "user_id" },
        { text: "Titre", value: "titre" },
        { text: "Public", value: "public" },
        { text: "Type", value: "type" },
        { text: "Domaine", value: "domaine" },
        { text: "Tags", value: "tags" },
        { text: "Evaluation", value: "evaluation" },
        { text: "Visionnement", value: "vues" },
        { text: "Actions", value: "id", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        id: "",
        user_id: "",
        public: "",
        titre: "",
        description: "",
        type: "",
        domaine: "",
        tags: "",
        evaluation: "",
        vues: ""
      },
      defaultItem: {
        id: "",
        user_id: "",
        public: "",
        titre: "",
        description: "",
        type: "",
        domaine: "",
        tags: "",
        evaluation: "",
        vues: ""
      },
      langue: ["Arabe", "Anglais", "Français"],
      categorie: [
        "Support de Cours",
        "Note de Cours",
        "Série de TD",
        "Série de TP",
        "Examination"
      ]
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.fetchDocuments();
    this.fetchUsers();
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.documents.indexOf(item);
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
            "/documents/doc=" + this.documents[this.editedIndex].id,
            {
              public: this.editedItem.public,
              titre: this.editedItem.titre,
              description: this.editedItem.description,
              langue: this.editedItem.langue,
              domaine: this.editedItem.domaine,
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
    deleteUser(item) {
      const index = this.documents.indexOf(item);
      if (confirm("Est-vous sûr de vouloir supprimer ce document ?")) {
        axios.delete("/documents/doc=" + this.documents[index].id).then(() => {
          this.$router.go();
        });
      }
    },
    fetchDocuments() {
      const token = localStorage.getItem("token");

      axios
        .get("/documents", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          this.documents = data.docs;
        });
    },
    fetchUsers() {
      const token = localStorage.getItem("token");

      axios
        .get("/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          data.users.forEach(e => {
            this.users.set(e.id, e.username);
          });
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
