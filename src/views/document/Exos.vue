<template>
  <div>
    <h1>Exercices</h1>
    <ul>
      <li v-for="doc in docs">
        <a @click="toDoc(doc.id)">{{ doc.titre }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      docs: []
    };
  },
  created() {
    this.fetchDocuments();
  },
  methods: {
    fetchDocuments() {
      axios
        .get("/documents/category=Serie_de_TP")
        .then(({ data }) => (this.docs = data.docs));
    },
    toDoc(id) {
      this.$router.push("/documents/view/" + id);
    }
  }
};
</script>

<style>
</style>
