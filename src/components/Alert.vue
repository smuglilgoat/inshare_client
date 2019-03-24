<template>
  <div>
    <b-alert show dismissible :variant="type">{{ message }}</b-alert>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
</style>
