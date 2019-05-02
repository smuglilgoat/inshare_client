<template>
  <div class="mt-2">
    <v-card>
      <v-toolbar flat dense color="info" class="font-weight-bold">
        {{doc.titre}}
        <v-btn flat icon color="pink" class="ml-2" v-if="isLoggedIn">
          <v-icon>favorite</v-icon>
        </v-btn>
        <v-btn flat icon @click="download" v-if="isLoggedIn">
          <v-icon>get_app</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-xs fluid class="pa-0">
          <v-layout row wrap justify-space-around align-center fill-height>
            <v-flex xs10>
              <v-avatar size="40px" class="mr-2">
                <img :src="author.avatar">
              </v-avatar>
              <v-tooltip top v-if="author.role === 'Etudiant'">
                <template v-slot:activator="{ on }">
                  <v-chip color="info" v-on="on" @click="toAuthor(author.id)">{{author.username}}</v-chip>
                </template>
                <span>Etudiant</span>
              </v-tooltip>
              <v-tooltip top v-else-if="author.role === 'Enseignant'">
                <template v-slot:activator="{ on }">
                  <v-chip color="success" v-on="on" @click="toAuthor(author.id)">{{author.username}}</v-chip>
                </template>
                <span>Enseignant</span>
              </v-tooltip>
              <v-chip v-else @click="toAuthor(author.id)">{{author.username}}</v-chip>
            </v-flex>
            <v-flex xs2 class="text-xs-right">
              <v-chip>{{doc.vues}} vues</v-chip>
            </v-flex>
            <v-flex xs12>{{doc.description}}</v-flex>
            <v-flex
              xs10
              class="caption font-weight-thin.font-italic"
            >Mis en ligne le {{doc.created_at}}</v-flex>
            <v-flex xs2 class="text-xs-right">
              <v-btn flat icon>
                <v-icon>report</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Description",
  props: {
    doc: {},
    author: {}
  },
  data() {
    return {};
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    download() {
      // axios
      //   .get("/documents/" + this.doc.id + ".jpg", {
      //     responseType: "blob"
      //   })
      //   .then(response => {
      //     const url = window.URL.createObjectURL(new Blob([response.data]));
      //     const link = document.createElement("a");
      //     link.href = url;
      //     link.setAttribute("download", "" + this.doc.id + ".jpg");
      //     document.body.appendChild(link);
      //     link.click();
      //   });

      var zip = new JSZip();
      zip.folder("Hello.txt", "Hello world\n");

      jQuery("#data_uri").on("click", function() {
        zip.generateAsync({ type: "base64" }).then(
          function(base64) {
            window.location = "data:application/zip;base64," + base64;
          },
          function(err) {
            jQuery("#data_uri").text(err);
          }
        );
      });
    },
    toAuthor(id) {
      this.$router.push("/profile/" + id);
    }
  }
};
</script>

<style>
</style>
