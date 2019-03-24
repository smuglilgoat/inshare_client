<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>--->
    <Alert type="danger" message="Hey nibba !"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Alert from "@/components/Alert.vue";

export default {
  name: "home",
  components: {
    HelloWorld,
    Alert
  }
};
</script>
