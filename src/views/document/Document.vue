<template>
  <div>
    <div v-if="doc.public == 0">
      <v-layout fill-height align-center justify-center ma-0>
        <i>Document en cours de modération...</i>
      </v-layout>
    </div>
    <div v-else>
      <ImgViewer :doc="doc" :images="images" v-if="doc.type == 'Image'"/>
      <VidViewer :doc="doc" :link="link" v-if="doc.type == 'Video'"/>
      <Description :doc="doc" :author="author"/>
      <Comment :doc="doc" class="mt-2 mb-2"/>
      <Comments :comments="comments"/>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import VidViewer from "@/components/document/viewers/VidViewer";
import ImgViewer from "@/components/document/viewers/ImgViewer";
import Description from "@/components/document/Description";
import Comments from "@/components/document/comment/Comments";
import Comment from "@/components/document/comment/Comment";

export default {
  components: {
    ImgViewer,
    VidViewer,
    Description,
    Comments,
    Comment
  },
  data() {
    return {
      doc: {},
      link: "",
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
            .then(({ data }) => (this.author = data.user));
          axios
            .get("/documents/" + this.doc.id + "/comments")
            .then(({ data }) => (this.comments = data.comments));
          switch (this.doc.type) {
            case "Image":
              axios
                .get("/documents/" + this.doc.id + "/images")
                .then(data => (this.images = data.data.images.slice()));
              break;

            case "Video":
              axios
                .get("/documents/" + this.doc.id + "/video")
                .then(data => (this.link = data.data.video.link));
              break;

            default:
              break;
          }
        });
    }
  }
};
</script>

<style>
</style>
