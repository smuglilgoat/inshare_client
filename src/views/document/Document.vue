<template>
  <div>
    <ImgViewer :doc="doc" :images="images"/>
    <Description :doc="doc" :author="author"/>
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
      author: {},
      images: []
    };
  },
  created() {
    this.fetchDocument();
  },
  methods: {
    fetchDocument() {
      axios
        .get("/documents/" + this.$route.params.id)
        .then(({ data }) => (this.doc = data.document))
        .then(() => {
          axios
            .get("/users/" + this.doc.user_id)
            .then(({ data }) => (this.author = data.user))
            .then(
              axios
                .get("/documents/" + this.doc.id + "/images")
                .then(data => (this.images = data.data.images.slice()))
            );
        });
    }
  }
};
</script>

<style>
</style>
