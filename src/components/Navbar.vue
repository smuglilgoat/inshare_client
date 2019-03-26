<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-2">
      <b-navbar-brand to="/">
        <i class="fas fa-home"></i>
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse"/>

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/auth/inscription" v-if="!isLoggedIn">Inscription</b-nav-item>
          <b-nav-item to="/auth/connexion" v-if="!isLoggedIn">Connexion</b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="logout">Logout</b-nav-item>
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
