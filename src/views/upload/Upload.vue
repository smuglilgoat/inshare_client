<template>
  <div>
    <h1>Uploader un document</h1>
    <v-container grid-list-md fluid>
      <v-layout align-center justify-center row fill-height wrap>
        <v-flex>
          <Uploader/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Uploader from "@/components/upload/Uploader";
export default {
  components: {
    Uploader
  }
};
</script>

<style>
</style>
