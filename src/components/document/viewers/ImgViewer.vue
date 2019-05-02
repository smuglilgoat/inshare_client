<template>
  <div class="tile is-10 is-vertical is-parent">
    <div class="viewer-wrapper">
      <viewer :images="images" @inited="inited" class="viewer" ref="viewer">
        <template slot-scope="scope">
          <figure class="images">
            <div class="image-wrapper" v-for="image in images">
              <img class="image" :src="image.path">
            </div>
          </figure>
        </template>
      </viewer>
    </div>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";

Vue.use(Viewer);
Viewer.setDefaults({
  zIndexInline: 2017
});

export default {
  name: "ImgViewer",
  props: {
    doc: {},
    images: {
      type: Array,
      required: true
    }
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    }
  }
};
</script>

<style lang="scss" scoped>
.viewer-wrapper {
  position: relative;
  background: #333;
  height: 100%;
}
.methods {
  margin-bottom: 1em;
  flex-wrap: wrap;
  & > * {
    margin-right: 0.75rem;
  }
}
.options-panel {
  .panel-block {
    padding: 0;
    .checkbox {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0.5em 0.75em;
    }
  }
}
.viewer {
  height: 100%;
  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;
    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;
      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>

