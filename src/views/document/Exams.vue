<template>
  <div>
    <h1>Examins</h1>
    <ul id="example-1">
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
        .get("/read/documents", {
          params: {
            type: "Examination"
          }
        })
        .then(({ data }) => (this.docs = data));
    },
    toDoc(id) {
      this.$router.push("/document/" + id);
    }
  }
};
</script>

<style>
</style>
