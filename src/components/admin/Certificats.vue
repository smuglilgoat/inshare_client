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
                <v-text-field v-model="editedItem.preuve" label="Fichier" readonly></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select :items="types" label="Type" v-model="editedItem.typec" readonly></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="editedItem.dateecheance" label="Echenace" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.dateecheance"
                    @input="menu2 = false"
                    locale="fr"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" flat @click="updateCertificat">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="certificats"
      :loading="loading"
      :search="search"
      class="elevation-1"
    >
      <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">{{ users.get(props.item.user_id) }}</td>
        <td class="text-xs-left">
          <a :href="`${props.item.preuve}`" target="_blank">Cliquez</a>
        </td>
        <td class="text-xs-left">{{ props.item.typec }}</td>
        <td class="text-xs-left">{{ dateFormat(props.item.dateecheance) }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteCertificat(props.item)">delete</v-icon>
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
var moment = require("moment");

export default {
  components: {
    Alert
  },
  name: "Certificats",
  data() {
    return {
      alert: {
        message: "",
        type: ""
      },
      search: "",
      dialog: false,
      loading: true,
      certificats: [],
      users: new Map(),
      headers: [
        { text: "ID", align: "left", value: "id" },
        { text: "Utilisateur", value: "user_id" },
        { text: "Fichier", value: "preuve" },
        { text: "Type", value: "typec" },
        { text: "Échéance", value: "dateecheance" },
        { text: "Actions", value: "id", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        id: "",
        user_id: "",
        preuve: "",
        typec: "",
        dateecheance: ""
      },
      defaultItem: {
        id: "",
        user_id: "",
        preuve: "",
        typec: "",
        dateecheance: ""
      },
      types: ["Badge", "Certificat de Scolarite", "Contrat de Travail"],
      menu2: false
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.fetchCertificats();
    this.fetchUsers();
  },
  methods: {
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    editItem(item) {
      this.editedIndex = this.certificats.indexOf(item);
      item.dateecheance = this.dateFormat(item.dateecheance);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    deleteCertificat(item) {
      const index = this.certificats.indexOf(item);
      if (confirm("Est-vous sûr de vouloir supprimer cet utilisateur ?")) {
        axios
          .delete("/delete/certificat", {
            data: {
              user_id: this.certificats[index].user_id
            }
          })
          .then(() => {
            this.$router.go();
          });
      }
    },
    updateCertificat() {
      if (this.editedIndex > -1) {
        const token = localStorage.getItem("token");
        axios
          .put("/update/certificat", {
            user_id: this.certificats[this.editedIndex].user_id,
            date: this.editedItem.dateecheance
          })
          .then(() => {
            this.close();
            this.$router.go();
          });
      }
      this.close();
    },
    fetchCertificats() {
      const token = localStorage.getItem("token");

      axios
        .get("/read/certificats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          this.certificats = data;
        });
    },
    fetchUsers() {
      const token = localStorage.getItem("token");

      axios
        .get("/read/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          data.forEach(e => {
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
