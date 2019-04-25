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
                <v-text-field v-model="editedItem.username" label="Nom d'utilisateur" readonly></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.email" label="Email" readonly></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select :items="roles" label="Role" v-model="editedItem.role"></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.domaine" label="Domaine"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedItem.niveau" label="Niveau"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" flat @click="updateUser">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      :search="search"
      class="elevation-1"
    >
      <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.role }}</td>
        <td class="text-xs-left">{{ props.item.domaine }}</td>
        <td class="text-xs-left">{{ props.item.niveau }}</td>
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
  name: "Users",
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
      users: [],
      headers: [
        { text: "ID", align: "left", value: "id" },
        { text: "Nom d'utilisateur", value: "username" },
        { text: "Email", value: "email" },
        { text: "Rôle", value: "role" },
        { text: "Domaine", value: "domaine" },
        { text: "Niveau", value: "niveau" },
        { text: "Actions", value: "id", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        id: "",
        username: "",
        email: "",
        role: "",
        domaine: "",
        niveau: ""
      },
      defaultItem: {
        id: "",
        username: "",
        email: "",
        role: "",
        domaine: "",
        niveau: ""
      },
      roles: [
        "Simple",
        "Moderateur",
        "Administrateur",
        "Etudiant",
        "Enseignant"
      ]
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    updateUser() {
      if (this.editedIndex > -1) {
        const token = localStorage.getItem("token");

        axios
          .put(
            "/update/user",
            {
              id: this.users[this.editedIndex].id,
              role: this.editedItem.role,
              domaine: this.editedItem.domaine,
              niveau: this.editedItem.niveau
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
      const index = this.users.indexOf(item);
      if (confirm("Est-vous sûr de vouloir supprimer cet utilisateur ?")) {
        axios
          .delete("/delete/user", {
            data: {
              id: this.users[index].id
            }
          })
          .then(() => {
            this.$router.go();
          });
      }
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
          this.users = data;
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
