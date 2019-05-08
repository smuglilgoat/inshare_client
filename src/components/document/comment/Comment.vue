<template>
  <v-card>
    <v-card-text>
      <v-textarea label="Commentaire" v-model="content"></v-textarea>
      <v-flex xs12 text-xs-right>
        <v-btn color="primary" @click="commentCreate">Enovyer</v-btn>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Comment",
  props: {
    doc: {}
  },
  data() {
    return {
      content: ""
    };
  },
  methods: {
    commentCreate() {
      const token = localStorage.getItem("token");
      axios
        .put(
          "/documents/" + this.doc.id + "/comments",
          {
            content: this.content
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => this.$router.go());
    }
  }
};
</script>

<style>
</style>
