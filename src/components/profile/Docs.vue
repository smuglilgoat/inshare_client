<template>
  <v-card>
    <v-toolbar dense flat color="primary">Vos documents</v-toolbar>
    <v-card-text>{{user.username}}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Docs",
  props: {
    user: {}
  }
};
</script>

<style>
</style>
