<template>
  <div>
    <h1>Utilisateurs</h1>
    <b-container fluid>
      <b-row>
        <b-col cols="8">
          <b-table
            id="usersTable"
            selectable
            select-mode="single"
            @row-selected="rowSelected"
            striped
            hover
            small
            responsive
            :items="users"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
          ></b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="usersTable"
            align="fill"
          ></b-pagination>
        </b-col>
        <b-col cols="4">
          <b-card>
            <b-card-text v-if="selected != null">
              <dl class="row">
                <dt class="col-sm-4 font-weight-normal">ID</dt>
                <dd class="col-sm-8 font-weight-bold">{{selected[0].id}}</dd>
                <dt class="col-sm-4 font-weight-normal">Utilisateur</dt>
                <dd class="col-sm-8 font-weight-bold">{{selected[0].username}}</dd>
              </dl>
              <hr>
              <label for>Rôle:</label>
              <b-form-select id="formRole" v-model="form.role" :options="roles" required></b-form-select>
              <label for class="mt-2">Domaine:</label>
              <b-form-input id="formRole" v-model="form.domaine" required></b-form-input>
              <label for class="mt-2">Niveau:</label>
              <b-form-input class="mb-2" id="formRole" v-model="form.niveau" required></b-form-input>

              <b-button block variant="primary" v-if="selected != null" @click="updateUser">
                <i class="fas fa-user-edit"></i>
              </b-button>
              <b-button block variant="danger" v-if="selected != null" @click="deleteUser">
                <i class="fas fa-user-minus"></i>
              </b-button>
            </b-card-text>
            <b-card-text v-else style=" opacity: 0.6">
              <b-spinner type="grow" class="mr-2 align-middle"></b-spinner>
              <strong>Selectionnez un Utilisateur...</strong>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      form: {
        role: "",
        domaine: "",
        niveau: ""
      },
      roles: ["Simple", "Etudiant", "Enseignant", "Moderateur"],
      perPage: 5,
      currentPage: 1,
      selected: null,
      rows: 0,
      fields: {
        id: {
          label: "ID",
          sortable: true
        },
        username: {
          label: "Nom",
          sortable: true
        },
        email: {
          label: "Email",
          sortable: true
        },
        role: {
          label: "Rôle",
          sortable: true
        },
        domaine: {
          label: "Domaine",
          sortable: true
        },
        niveauense: {
          label: "Niveau",
          sortable: true
        },
        niveauetud: {
          label: "Niveau",
          sortable: true
        }
      },
      users: []
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    updateUser() {
      const token = localStorage.getItem("token");

      axios
        .put(
          "/update/user",
          {
            id: this.selected[0].id,
            role: this.form.role,
            domaine: this.form.domaine,
            niveau: this.form.niveau
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          this.$router.go();
        });
    },
    deleteUser() {
      axios
        .delete("/delete/user", {
          data: {
            id: this.selected[0].id
          }
        })
        .then(() => {
          this.$router.go();
        });
    },
    rowSelected(items) {
      this.selected = items;
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
          this.rows = this.users.length;
        });
    }
  }
};
</script>

<style>
</style>
