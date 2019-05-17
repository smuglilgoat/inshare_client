<template>
  <div>
    <h1>Search</h1>
    <v-container grid-list-xs>
      <v-layout wrap>
        <v-flex xs12 sm11>
          <tags-input
            element-id="tags"
            v-model="selectedTags"
            :existing-tags="existingTags"
            :typeahead="true"
            :only-existing-tags="true"
          ></tags-input>
        </v-flex>
        <v-flex xs12 sm1 text-xs-right>
          <v-btn color="primary" @click="fetchDocuments()">
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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
      selectedTags: [],
      existingTags: null,
      docs: [],
      users: new Map(),
      loading: true
    };
  },
  created() {
    this.fetchTags();
  },
  methods: {
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
      axios
        .get("/documents/query", {
          params: {
            tags: JSON.stringify(this.selectedTags)
          }
        })
        .then(({ data }) => {
          this.docs = data.docs[0];
          this.docs.forEach(doc => {
            axios
              .get("/documents/" + doc.id + "/images")
              .then(data => (doc.preview = data.data.images[0].path));
          });
        });
      axios.get("/users-list").then(({ data }) => {
        data.users.forEach(e => {
          this.users.set(e.id, e.username);
        });
        this.$forceUpdate();
        this.loading = false;
      });
      this.selectedTags = [];
    },
    toDoc(id) {
      this.$router.push("/documents/view/" + id);
    }
  }
};
</script>

<style>
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

