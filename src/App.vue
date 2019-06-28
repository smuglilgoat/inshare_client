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
        <v-list-tile to="/search">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Recherche</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-subheader inset>Documents</v-subheader>
        <v-list-tile to="/documents/cours">
          <v-list-tile-action>
            <v-icon>school</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Cours</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/documents/exos">
          <v-list-tile-action>
            <v-icon>collections_bookmark</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Séries d'exercices</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/documents/exams">
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sujets d'examins</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="isAdmin"></v-divider>
        <v-subheader inset v-if="isAdmin">Administration</v-subheader>
        <v-list-tile to="/admin/users" v-if="isAdmin">
          <v-list-tile-action>
            <v-icon>assignment_ind</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Utilisateurs</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/admin/certificats" v-if="isAdmin">
          <v-list-tile-action>
            <v-icon>assignment_turned_in</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Certificats</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/admin/documents" v-if="isAdmin">
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Documents</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <i class="fas fa-book-open"></i>
        inShare
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline color="primary" to="/upload" v-if="isLoggedIn">
        <v-icon class="mr-2">cloud_upload</v-icon>Uploader
      </v-btn>
      <v-divider vertical inset v-if="isLoggedIn"></v-divider>

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
          <v-list-tile v-if="isLoggedIn" to="/profile">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile v-if="isLoggedIn" to="/account">
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Paramètres</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile @click="dark = !dark" ripple="ripple" rel="noopener">
            <v-list-tile-action>
              <v-icon>invert_colors</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Thème</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
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
    isAdmin() {
      return this.$store.getters.isAdmin;
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