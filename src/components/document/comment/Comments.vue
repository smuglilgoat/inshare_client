<template>
  <div>
    <v-card v-if="comments.length == 0">
      <v-card-text>Aucun commentaire...</v-card-text>
    </v-card>
    <v-container fluid grid-list-xs v-else>
      <v-layout row wrap>
        <v-flex xs12 v-for="comment in comments" :key="comment.id">
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs9>
                  <v-avatar size="40px">
                    <img :src="users.get(comment.user_id ).avatar">
                  </v-avatar>

                  <v-tooltip top v-if="users.get(comment.user_id).role === 'Etudiant'">
                    <template v-slot:activator="{ on }">
                      <v-chip
                        color="info"
                        v-on="on"
                        @click="toAuthor(comment.user_id)"
                      >{{users.get(comment.user_id).username}}</v-chip>
                    </template>
                    <span>Etudiant</span>
                  </v-tooltip>
                  <v-tooltip top v-else-if="users.get(comment.user_id).role === 'Enseignant'">
                    <template v-slot:activator="{ on }">
                      <v-chip
                        color="success"
                        v-on="on"
                        @click="toAuthor(comment.user_id)"
                      >{{users.get(comment.user_id ).username}}</v-chip>
                    </template>
                    <span>Enseignant</span>
                  </v-tooltip>
                  <v-chip
                    v-else
                    @click="toAuthor(comment.user_id)"
                  >{{users.get(comment.user_id).username}}</v-chip>
                </v-flex>
                <v-flex xs3 text-xs-right>{{timeAgo(comment.created_at)}}</v-flex>
                <v-flex xs12 class="mt-2">{{comment.content}}</v-flex>
                <v-flex xs12 text-xs-right>
                  <v-btn color="error" icon small v-if="isAdmin">
                    <v-icon small @click="deleteComment(comment.id)">delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
var moment = require("moment");
moment.updateLocale("fr", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    ss: "%d secondes",
    m: "une minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "une année",
    yy: "%d années"
  }
});
export default {
  name: "Comments",
  data() {
    return {
      users: new Map()
    };
  },
  props: {
    comments: {}
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios.get("/users-list").then(({ data }) => {
        data.users.forEach(e => {
          this.users.set(e.id, e);
        });
        this.loading = false;
      });
    },
    deleteComment(id) {
      const token = localStorage.getItem("token");
      axios
        .delete(
          "/documents/" + this.comments[0].document_id + "/comments/" + id,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(this.$router.go());
    },
    toAuthor(id) {
      this.$router.push("/profile/" + id);
    },
    timeAgo(time) {
      return moment(time).fromNow();
    }
  }
};
</script>

<style>
</style>
