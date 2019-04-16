<template>
  <v-app id="inspire" :dark="dark">
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense>
        <v-subheader inset>Navigation</v-subheader>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Acceuil</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="isLoggedIn" to="/profile">
          <v-list-tile-action>
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="isLoggedIn" to="/account">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Paramètres</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <i class="fas fa-book-open"></i>
        PFE
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="dark = !dark">
        <v-icon>invert_colors</v-icon>
      </v-btn>
      <v-menu
        offset-y
        origin="center center"
        :nudge-bottom="10"
        transition="scale-transition"
        v-if="isLoggedIn"
      >
        <v-btn icon large flat slot="activator">
          <v-avatar size="30px">
            <img :src="userAvatar">
          </v-avatar>
        </v-btn>
        <v-list class="pa-0">
          <v-list-tile @click="logout" ripple="ripple" rel="noopener">
            <v-list-tile-action>
              <v-icon>power_settings_new</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Deconnexion</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn outline color="primary" to="/auth/login" v-if="!isLoggedIn">
        <v-icon class="mr-1">account_circle</v-icon>Se connecter
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    dark: true
  }),
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userAvatar() {
      return this.$store.getters.userAvatar;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => this.$router.push("/"));
    }
  }
};
</script>

  <!-- <div class="d-flex" id="wrapper" v-bind:class="{ toggled: toggled }">
    <!-- Sidebar 
    <div class="bg-light" id="sidebar-wrapper">
      <div class="sidebar-heading">Start Bootstrap</div>
      <div class="list-group list-group-flush">
        <a href="#" class="list-group-item list-group-item-action bg-light">Dashboard</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Shortcuts</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Overview</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Events</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Profile</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Status</a>
      </div>
    </div>
    <!-- /#sidebar-wrapper

    <!-- Page Content 
    <div id="page-content-wrapper">
      <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow-sm">
        <button class="navbar-toggler" id="menu-toggle" @click="toggleSidebar">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <b-navbar-brand to="/" class>
          <i class="fas fa-book-reader"></i>
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
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template slot="button-content">
                <i class="far fa-id-card" v-if="isLoggedIn"></i>
                <i class="fas fa-user" v-else></i>
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

      <div class="container-fluid">
        <router-view/>
      </div>
    </div>
    <!-- /#page-content-wrapper
  </div>-->