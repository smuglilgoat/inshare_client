<template>
  <div>
    <ImgViewer :doc="doc" :images="images"/>
    <Description :doc="doc" :author="author"/>
    <Comment :doc="doc" class="mt-2"/>
    <Comments :comments="comments"/>
  </div>
</template>

<script>
import ImgViewer from "@/components/document/viewers/ImgViewer";
import Description from "@/components/document/Description";
import Comments from "@/components/document/comment/Comments";
import Comment from "@/components/document/comment/Comment";

export default {
  components: {
    ImgViewer,
    Description,
    Comments,
    Comment
  },
  data() {
    return {
      doc: {},
      author: {},
      images: [],
      comments: []
    };
  },
  created() {
    this.fetchDocument();
  },
  methods: {
    fetchDocument() {
      axios
        .get("/documents/doc=" + this.$route.params.id)
        .then(({ data }) => (this.doc = data.document))
        .then(() => {
          axios
            .get("/users/" + this.doc.user_id)
            .then(({ data }) => (this.author = data.user))
            .then(
              axios
                .get("/documents/" + this.doc.id + "/images")
                .then(data => (this.images = data.data.images.slice()))
                .then(
                  axios
                    .get("/documents/" + this.doc.id + "/comments")
                    .then(({ data }) => (this.comments = data.comments))
                )
            );
        });
    }
  }
};
</script>

<style>
</style>
