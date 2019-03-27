<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-2">
      <b-navbar-brand to="/">
        <i class="fas fa-book-open"></i>
        PFE
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse"/>

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Utilisateur" right>
            <b-dropdown-item to="/auth/inscription" v-if="!isLoggedIn">Inscription</b-dropdown-item>
            <b-dropdown-item to="/auth/connexion" v-if="!isLoggedIn">Connexion</b-dropdown-item>
            <b-dropdown-item v-if="isLoggedIn" to="/auth/connexion">Deconnexion</b-dropdown-item>
            <b-dropdown-item v-if="isLoggedIn" @click="logout">Deconnexion</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Navrbar",
  computed: {
    ...mapGetters("auth", ["isLoggedIn"])
  },
  methods: {
    ...mapActions("auth", ["logout"])
  }
};
</script>

<style>
</style>
