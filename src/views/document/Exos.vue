<template>
  <div>
    <v-layout row>
      <v-flex xs10>
        <h1>Séries</h1>
      </v-flex>
      <v-flex xs2 text-xs-right>
        <v-btn color="primary" @click="changeView" :disabled="docs.length == 0">
          <v-icon v-if="viewCards">view_list</v-icon>
          <v-icon v-if="viewList">view_module</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <div v-if="isInitial || isLoading">
      <v-layout fill-height align-center justify-center ma-0>
        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
      </v-layout>
    </div>

    <div v-if="isSuccess && viewList && docs.length == 0">
      <v-layout fill-height align-center justify-center ma-0>
        <i>Aucun document :'(</i>
      </v-layout>
    </div>

    <div v-if="isSuccess && viewList && docs.length != 0">
      <v-list two-line>
        <v-list-tile avatar v-for="doc in docs" :key="doc.created_at" @click="toDoc(doc.id)">
          <v-list-tile-avatar>
            <v-icon v-if="doc.type == 'Image'">photo_library</v-icon>
            <v-icon v-if="doc.type == 'Video'">video_library</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{doc.titre}}</v-list-tile-title>
            <v-list-tile-sub-title class="text--primary">{{users.get(doc.user_id)}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{doc.description}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>
              {{doc.vues}}
              <v-icon small>remove_red_eye</v-icon>
              <br>
              {{doc.evaluation}}
              <v-icon small>stars</v-icon>
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </div>

    <div v-if="isSuccess && viewCards">
      <v-layout row wrap>
        <v-flex
          xs12
          sm4
          lg3
          v-for="doc in docs"
          :key="doc.created_at"
          @click="toDoc(doc.id)"
          grow
          v-if="show"
        >
          <v-card>
            <div class="embed-container" v-if="doc.type == 'Video'">
              <iframe
                :src="'https://www.youtube.com/embed/' + doc.preview"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                v-if="doc.provider == 'YouTube'"
              ></iframe>
              <iframe
                :src="'https://player.vimeo.com/video/' + doc.preview"
                frameborder="0"
                allow="autoplay; fullscreen"
                allowfullscreen
                v-if="doc.provider == 'Vimeo'"
              ></iframe>
              <iframe
                frameborder="0"
                :src="'https://lrp.adm.dailymotion.com/embed/video/' + doc.preview"
                allowfullscreen
                allow="autoplay"
                v-if="doc.provider == 'Dailymotion'"
              ></iframe>
            </div>

            <v-img
              height="200"
              contain
              :src="doc.preview"
              transition="fade-transition"
              aspect-ratio="1"
              class="grey darken-4"
              v-if="doc.type == 'Image'"
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
    </div>
  </div>
</template>

<script>
const STATUS_INITIAL = 0,
  STATUS_LOADING = 1,
  STATUS_SUCCESS = 2;

const VIEW_LIST = 0,
  VIEW_CARDS = 1;

export default {
  data() {
    return {
      docs: [],
      users: new Map(),
      currentStatus: STATUS_INITIAL,
      currentView: 0,
      show: true
    };
  },
  created() {
    this.currentStatus = STATUS_INITIAL;
    this.fetchDocuments();
    this.fetchUsernames();
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isLoading() {
      return this.currentStatus === STATUS_LOADING;
    },
    viewList() {
      return this.currentView === VIEW_LIST;
    },
    viewCards() {
      return this.currentView === VIEW_CARDS;
    }
  },
  methods: {
    changeView() {
      if (this.viewCards) {
        this.currentView = VIEW_LIST;
      } else {
        this.currentView = VIEW_CARDS;
      }
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$nextTick(() => {});
      });
    },
    fetchDocuments() {
      this.currentStatus = STATUS_LOADING;

      axios.get("/documents/category=Serie_de_TP").then(({ data }) => {
        let docs = data.docs;
        docs.forEach(doc => {
          switch (doc.type) {
            case "Image":
              axios
                .get("/documents/" + doc.id + "/images")
                .then(data => (doc.preview = data.data.images[0].path));
              break;
            case "Video":
              axios.get("/documents/" + doc.id + "/video").then(data => {
                doc.provider = data.data.video.provider;
                doc.preview = data.data.video.link;
              });
              break;
            default:
              break;
          }
        });
        this.docs = docs;
      });
      axios.get("/documents/category=Serie_de_TD").then(({ data }) => {
        let docs = data.docs;
        docs.forEach(doc => {
          switch (doc.type) {
            case "Image":
              axios
                .get("/documents/" + doc.id + "/images")
                .then(data => (doc.preview = data.data.images[0].path));
              break;
            case "Video":
              axios
                .get("/documents/" + doc.id + "/video")
                .then(data => (doc.preview = data.data.video.link));
              break;
            default:
              break;
          }
        });
        this.docs = this.docs.concat(docs);
      });
    },
    fetchUsernames() {
      this.currentStatus = STATUS_LOADING;

      axios.get("/users-list").then(({ data }) => {
        data.users.forEach(e => {
          this.users.set(e.id, e.username);
        });
        this.currentStatus = STATUS_SUCCESS;
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
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

