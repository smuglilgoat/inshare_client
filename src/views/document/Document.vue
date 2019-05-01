<template>
  <div>
    <ImgViewer :doc="doc"/>
    <Description :doc="doc" :auther="auther"/>
  </div>
</template>

<script>
import ImgViewer from "@/components/document/viewers/ImgViewer";
import Description from "@/components/document/Description";
export default {
  components: {
    ImgViewer,
    Description
  },
  data() {
    return {
      doc: {},
      auther: {}
    };
  },

  created() {
    this.fetchDocument();
  },
  methods: {
    fetchDocument() {
      axios
        .get("/documents/" + this.$route.params.id)
        .then(({ data }) => {
          this.doc = data.document;
        })
        .then(() => {
          axios
            .get("/users/" + this.doc.user_id)
            .then(({ data }) => (this.auther = data.user));
        });
    }
  }
};
</script>

<style>
</style>
