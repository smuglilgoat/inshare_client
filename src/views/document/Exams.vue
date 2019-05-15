<template>
  <div>
    <h1>Examins</h1>
    <div v-if="loading">
      <v-layout fill-height align-center justify-center ma-0>
        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
      </v-layout>
    </div>
    <v-container grid-list-xs v-else>
      <v-layout row wrap>
        <v-flex
          xs12
          sm4
          lg3
          v-for="doc in docs"
          :key="doc.created_at"
          @click="toDoc(doc.id)"
          class="grow"
        >
          <v-card>
            <v-img
              height="200"
              contain
              :src="doc.preview"
              transition="fade-transition"
              aspect-ratio="1"
              class="grey darken-4"
            >
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </template>
            </v-img>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0" v-if="doc.titre.length < 27">{{doc.titre}}</h3>
                <h3 class="headline mb-0" v-else>{{doc.titre.substring(0,22)+" ..."}}</h3>
                <div v-if="doc.description.length < 104">{{doc.description}}</div>
                <div v-else>{{doc.description.substring(0,100)+" ..."}}</div>
              </div>
            </v-card-title>
            <v-card-text>
              <div text-xs-center>
                {{users.get(doc.user_id)}}
                <v-spacer></v-spacer>
                {{doc.vues}}
                <v-icon small>remove_red_eye</v-icon>
                {{doc.evaluation}}
                <v-icon small>stars</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      docs: [],
      users: new Map(),
      loading: true
    };
  },
  created() {
    this.fetchDocuments();
    this.fetchUsernames();
  },
  methods: {
    fetchDocuments() {
      axios.get("/documents/category=Examination").then(({ data }) => {
        let docs = data.docs;
        docs.forEach(doc => {
          axios
            .get("/documents/" + doc.id + "/images")
            .then(data => (doc.preview = data.data.images[0].path));
        });
        this.docs = docs;
      });
    },
    fetchUsernames() {
      axios.get("/users-list").then(({ data }) => {
        data.users.forEach(e => {
          this.users.set(e.id, e.username);
        });
        this.$forceUpdate();
        this.loading = false;
      });
    },
    toDoc(id) {
      this.$router.push("/documents/view/" + id);
    }
  }
};
</script>

<style scoped>
.grow {
  -webkit-transition: all 0.5s ease-out;
  -moz-transition: all 0.5s ease-out;
  -ms-transition: all 0.5s ease-out;
  -o-transition: all 0.5s ease-out;
  transition: all 0.5s ease-out;
  z-index: 1;
}

.grow:hover {
  -webkit-transform: scale(1.0125);
  -moz-transform: scale(1.0125);
  -ms-transform: scale(1.0125);
  -o-transform: scale(1.0125);
  transform: scale(1.0125);
  z-index: 1;
}
</style>

