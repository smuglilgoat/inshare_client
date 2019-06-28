<template>
  <div class="embed-container">
    <iframe
      :src="'https://www.youtube.com/embed/' + video.link"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      v-if="video.provider == 'YouTube'"
    ></iframe>
    <iframe
      :src="'https://player.vimeo.com/video/' + video.link"
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
      v-if="video.provider == 'Vimeo'"
    ></iframe>
    <iframe
      frameborder="0"
      :src="'https://lrp.adm.dailymotion.com/embed/video/' + video.link"
      allowfullscreen
      allow="autoplay"
      v-if="video.provider == 'Dailymotion'"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "VidViewer",
  props: {
    video: {}
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


