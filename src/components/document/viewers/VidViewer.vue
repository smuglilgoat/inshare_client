<template>
  <div class="embed-container">
    <iframe
      :src="'https://www.youtube.com/embed/' + link"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "VidViewer",
  props: {
    doc: {},
    link: ""
  }
};
</script>

<style>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>


