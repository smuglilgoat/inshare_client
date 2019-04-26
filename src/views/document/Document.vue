<template>
  <div>
    <h1>Document {{ doc .id}}</h1>
    <ImgViewer :doc="doc"/>
  </div>
</template>

<script>
import ImgViewer from "@/components/document/viewers/ImgViewer";
export default {
  components: {
    ImgViewer
  },
  data() {
    return {
      doc: {}
    };
  },
  created() {
    this.fetchDocument();
  },
  methods: {
    fetchDocument() {
      axios
        .get("/read/document", {
          params: {
            id: this.$route.params.id
          }
        })
        .then(({ data }) => (this.doc = data));
    }
  }
};
</script>

<style>
</style>
