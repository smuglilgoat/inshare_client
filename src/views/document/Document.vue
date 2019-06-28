<template>
  <div>
    <div v-if="doc.public == 0">
      <v-container fluid fill-height>
        <v-layout align-center justify-center text-xs-center>
          <v-flex xs12>
            <img src="../../assets/minus-circle-solid.png" alt="Document cours de">
            <h1>Document en cours de modération...</h1>
            <h4>Veuilliez attendre la vérification de votre document par un modérateur</h4>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div v-else>
      <ImgViewer :doc="doc" :images="images" v-if="doc.type == 'Image'"/>
      <VidViewer :video="video" :link="video" v-if="doc.type == 'Video'"/>
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
      video: {},
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
                .then(data => (this.video = data.data.video));
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
