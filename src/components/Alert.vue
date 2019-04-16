<template>
  <div>
    <v-alert value="true" :type="type" dismissible>{{ message }}</v-alert>
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
