<template>
  <div>
    <h1>Utilisateurs</h1>

    <b-table
      id="usersTable"
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
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      perPage: 5,
      currentPage: 1,
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
    fetchUsers() {
      const token = localStorage.getItem("token");

      axios
        .get("/view/users", {
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
