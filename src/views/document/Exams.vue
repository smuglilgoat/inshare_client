<template>
  <div>
    <h1>Examins</h1>
    <ul>
      <li v-for="doc in docs">
        <a @click="toDoc(doc.id)">{{ doc.titre }}</a>
      </li>
    </ul>
    <v-card v-for="doc in docs" :key="doc.created_at">
      <v-img aspect-ratio="2.75"></v-img>

      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{doc.titre}}</h3>
          <div></div>
        </div>
      </v-card-title>

      <v-card-text>{{doc.description}}</v-card-text>
      <v-card-actions>
        {{doc.vues}}
        <v-icon>remove_red_eye</v-icon>
        {{doc.evaluation}}
        <v-icon>stars</v-icon>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      docs: [],
      images: new Map()
    };
  },
  created() {
    this.fetchDocuments();
  },
  methods: {
    fetchDocuments() {
      axios.get("/documents/category=Examination").then(({ data }) => {
        this.docs = data.docs;
        this.docs.forEach(doc => {
          axios
            .get("/documents/" + doc.id + "/images")
            .then(data => this.images.set(doc.id, data.data.images.slice()));
        });
      });
    },
    toDoc(id) {
      this.$router.push("/documents/view/" + id);
    }
  }
};
</script>

<style>
</style>
