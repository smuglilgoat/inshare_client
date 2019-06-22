<template>
  <div class="mt-2">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Signaler</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select :items="subjects" label="Sujet" v-model="report.subject"></v-select>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="report.text" label="Message"></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" flat @click="reportDoc">Envoyer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-toolbar card flat dense color="primary">
        <v-toolbar-title>{{doc.titre}}</v-toolbar-title>
        <v-spacer></v-spacer>
        {{doc.evaluation}}
        <v-icon class="ml-1">stars</v-icon>

        <v-btn flat icon @click="reportDialog" v-if="isLoggedIn">
          <v-icon>report</v-icon>
        </v-btn>
        <v-btn
          flat
          icon
          @click="download"
          v-if="isLoggedIn && doc.type != 'Video'"
          style="margin-left: 0px"
        >
          <v-icon>get_app</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-xs fluid class="pa-0">
          <v-layout row wrap justify-space-around align-center fill-height>
            <v-flex xs10>
              <v-avatar size="40px">
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
            <v-flex xs2 text-xs-right>{{doc.vues}} vues</v-flex>
            <v-flex xs12 class="mt-2">
              <span class="font-weight-bold">Description:</span>
              <br>
              {{doc.description}}
            </v-flex>
            <v-divider dark></v-divider>
            <v-flex class="caption font-weight-thin.font-italic">Mis en ligne le: {{doc.created_at}}</v-flex>
            <v-flex text-xs-center text-sm-right>
              <v-rating
                v-if="isLoggedIn"
                v-model="rating"
                style="margin-right: 0px"
                background-color="orange lighten-3"
                color="orange"
              ></v-rating>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  name: "Description",
  components: {
    StarRating
  },
  props: {
    doc: {},
    author: {}
  },
  data() {
    return {
      dialog: false,
      report: {
        subject: "",
        text: ""
      },
      default: {
        subject: "",
        text: ""
      },
      subjects: [
        "Ce document contient un contenu inapproprié",
        "Je suis l'auteur de ce document et je souhaite le retirer",
        "Autre ..."
      ],
      rating: null
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    rating(val) {
      const token = localStorage.getItem("token");

      axios
        .post(
          "/documents/" + this.doc.id + "/rate",
          {
            rating: val
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => this.$router.go())
        .catch(error => console.log(error));
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    reportDialog() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.report = Object.assign({}, this.default);
    },
    reportDoc() {
      const token = localStorage.getItem("token");

      axios
        .post(
          "/documents/" + this.doc.id + "/report",
          {
            subject: this.report.subject,
            message: this.report.text
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          this.close();
          this.$router.go();
        });
    },
    download() {
      axios
        .get("/documents/" + this.doc.id + "/download", {
          responseType: "blob"
        })
        .then(response => {
          console.log(response);
          const blob = new Blob([response.data], {
            type: "application/zip"
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file");
          document.body.appendChild(link);
          link.click();
        });
    },
    toAuthor(id) {
      this.$router.push("/profile/" + id);
    },
    rateDoc() {
      const token = localStorage.getItem("token");

      axios
        .post(
          "/documents/" + this.doc.id + "/rate",
          {
            rating: this.rating
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => this.$router.go());
    }
  }
};
</script>

<style>
</style>
