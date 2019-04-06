<template>
  <div>
    <h1>Utilisateurs</h1>
    <b-table striped hover small responsive :items="users" :fields="fields"></b-table>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
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
        });
    }
  }
};
</script>

<style>
</style>
