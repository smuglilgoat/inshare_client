<template>
  <div class="home">
    <v-container fluid fill-height>
      <v-layout align-center justify-center text-xs-center>
        <v-flex xs12>
          <img src="../assets/book-reader-solid.png" alt="Logo in Share" />
          <h1>Bienvenue sur inShare !</h1>
          <h4>La plateforme de partage de documents universitaires</h4>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid fill-height>
      <v-layout align-center justify-center text-xs-center>
        <v-flex xs12>
          <span v-if="user.username">Bienvenue à vous {{user.username}}</span>
          <span v-else>
            Vous êtes entrain de parcourir le site entant que
            <i>Visiteur</i>.
            <br />Inscrivez-vous afin de pouvoir:
            <br />
            <div align="center">
              <table>
                <tr>
                  <td>
                    <v-icon>get_app</v-icon>
                  </td>
                  <td>Télécharger des documents</td>
                </tr>
                <tr>
                  <td>
                    <v-icon>supervisor_account</v-icon>
                  </td>
                  <td>Créer et faire partie des groupes privés</td>
                </tr>
                <tr>
                  <td>
                    <v-icon>comment</v-icon>
                  </td>
                  <td>Intéragir avec la communauté</td>
                </tr>
              </table>
            </div>
          </span>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      user: null
    };
  },
  created() {
    this.user = this.$store.getters.user;
  }
};
</script>
