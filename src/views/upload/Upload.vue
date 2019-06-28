<template>
  <div>
    <h1>Uploader un document</h1>
    <v-container grid-list-md fluid>
      <v-layout align-center justify-center row fill-height wrap>
        <v-flex xs12>
          <v-select
            :items="types"
            v-model="type"
            label="Que souhaitez-vous mettre ne ligne ?"
            v-if="type == ''"
          ></v-select>
        </v-flex>
        <v-flex xs12 v-if="type == 'Image'">
          <ImageUploader/>
        </v-flex>
        <v-flex xs12 v-if="type == 'Video'">
          <VideoUploader/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImageUploader from "@/components/upload/ImageUploader";
import VideoUploader from "@/components/upload/VideoUploader";

export default {
  components: {
    ImageUploader,
    VideoUploader
  },
  data() {
    return {
      type: "",
      types: ["Image", "Video"]
    };
  }
};
</script>

<style>
</style>
