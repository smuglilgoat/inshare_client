<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-2">
      <b-navbar-brand to="/">
        <i class="fas fa-book-open"></i>
        PFE
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse"/>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input class="mr-sm-2" type="text" placeholder="Search"/>
            <b-button variant="outline-success" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <i class="fas fa-user"></i>
            </template>
            <b-dropdown-item to="/auth/register" v-if="!isLoggedIn">Inscription</b-dropdown-item>
            <b-dropdown-item to="/auth/login" v-if="!isLoggedIn">Connexion</b-dropdown-item>
            <b-dropdown-item v-if="isLoggedIn" to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item v-if="isLoggedIn" to="/account">Parametres</b-dropdown-item>
            <b-dropdown-divider v-if="isLoggedIn"/>
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
