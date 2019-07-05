<template>
  <v-container grid-list-xs fluid fill-height text-xs-center>
    <v-layout align-center row warp justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" flat>
            <v-toolbar-title>Contactez-nous !</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-select :items="subjects" label="Sujet" v-model="contact.subject"></v-select>
              <v-textarea v-model="contact.text" label="Message"></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" flat @click="contacter">Envoyer</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      contact: {
        subject: "",
        text: ""
      },
      subjects: ["Je ne peux plus accéder à mon compte", "Autre ..."]
    };
  },
  methods: {
    contacter() {
      axios
        .post("/contact", {
          subject: this.contact.subject,
          message: this.contact.text
        })
        .then(() => this.$router.go("/"));
    }
  }
};
</script>

<style>
</style>
