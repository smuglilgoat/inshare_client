<template>
  <div>
    <h1>Search</h1>
    <v-layout row>
      <v-flex xs8 sm10>
        <tags-input
          element-id="tags"
          v-model="selectedTags"
          :existing-tags="existingTags"
          :typeahead="true"
          :only-existing-tags="true"
        ></tags-input>
      </v-flex>
      <v-flex xs2 text-xs-center sm1 text-sm-right>
        <v-btn color="primary" @click="fetchDocuments()" icon>
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs2 text-xs-center sm1 text-sm-right>
        <v-btn icon color="primary" @click="changeView" :disabled="docs.length == 0">
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

    <div v-if="!isInitial && !isLoading && docs.length == 0">
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
          style="margin-left: 2px"
          v-if="show"
        >
          <v-card>
            <div class="embed-container" v-if="doc.type == 'Video'">
              <iframe
                :src="'https://www.youtube.com/embed/' + doc.preview"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>>
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
      selectedTags: [],
      existingTags: null,
      docs: [],
      users: new Map(),
      currentStatus: null,
      currentView: 0,
      show: true
    };
  },
  created() {
    this.currentStatus = STATUS_INITIAL;
    this.fetchTags();
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
    fetchTags() {
      axios.get("/tags").then(({ data }) => {
        let tagList = "{ ";
        data.tags.forEach(tag => {
          tagList =
            tagList + '"' + tag.nom + '"' + ":" + '"' + tag.nom + '"' + ",";
        });
        tagList = tagList.slice(0, -1);
        tagList = tagList + "}";
        tagList = JSON.parse(tagList);
        this.existingTags = tagList;
      });
    },
    fetchDocuments() {
      this.currentView = VIEW_LIST;

      axios
        .get("/documents/query", {
          params: {
            tags: JSON.stringify(this.selectedTags)
          }
        })
        .then(({ data }) => {
          this.docs = data.result;
          this.docs.forEach(doc => {
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
        });
      axios.get("/users-list").then(({ data }) => {
        data.users.forEach(e => {
          this.users.set(e.id, e.username);
        });
      });
      this.selectedTags = [];
      this.currentStatus = STATUS_SUCCESS;
    },
    toDoc(id) {
      this.$router.push("/documents/view/" + id);
    }
  }
};
</script>

<style>
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
/* The input */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tags-input input {
  flex: 1;
  background: transparent;
  border: none;
}

.tags-input input:focus {
  outline: none;
}

.tags-input input[type="text"] {
  color: #495057;
}

.tags-input-wrapper-default {
  padding: 0.5rem 0.25rem;

  background: #fff;

  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-color: #dbdbdb;
}

/* The tag badges & the remove icon */
.tags-input span {
  margin-right: 0.3rem;
}

.tags-input-remove {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
}

.tags-input-remove:before,
.tags-input-remove:after {
  content: "";
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  background: #5dc282;

  height: 2px;
  margin-top: -1px;
}

.tags-input-remove:before {
  transform: rotate(45deg);
}
.tags-input-remove:after {
  transform: rotate(-45deg);
}

/* Tag badge styles */
.tags-input-badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.tags-input-badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}

.tags-input-badge-selected-default {
  color: #212529;
  background-color: #f0f1f2;
}

/* Typeahead - badges */
.typeahead-badges > span {
  cursor: pointer;
  margin-right: 0.3rem;
}

/* Typeahead - dropdown */
.typeahead-dropdown {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
}

.typeahead-dropdown li {
  padding: 0.25rem 1rem;
  cursor: pointer;
}

/* Typeahead elements style/theme */
.tags-input-typeahead-item-default {
  color: #fff;
  background-color: #343a40;
}

.tags-input-typeahead-item-highlighted-default {
  color: #fff;
  background-color: #007bff;
}
</style>

