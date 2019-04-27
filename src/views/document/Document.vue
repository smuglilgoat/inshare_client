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
        .get("/read/document", {
          params: {
            id: this.$route.params.id
          }
        })
        .then(({ data }) => {
          this.doc = data;
        })
        .then(() => {
          axios
            .get("/read/user/" + this.doc.user_id)
            .then(({ data }) => (this.auther = data));
        });
    }
  }
};
</script>

<style>
</style>
