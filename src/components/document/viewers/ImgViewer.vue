<template>
  <div>
    <div class="viewer-wrapper" v-viewer>
      <img :src="doc.link">
    </div>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";
Vue.use(Viewer);
export default {
  name: "ImgViewer",
  props: {
    doc: {}
  }
};
</script>

<style>
</style>
