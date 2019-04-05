<template>
  <div>
    <b-card no-body class="ml-2 mr-2">
      <b-tabs pills card vertical>
        <b-tab title="Changer vos indentifiants" active>
          <b-card-text>
            <Info/>
          </b-card-text>
        </b-tab>
        <b-tab title="Changer votre mot de passe">
          <b-card-text>
            <Password/>
          </b-card-text>
        </b-tab>
        <b-tab title="Changer votre avatar">
          <b-card-text>
            <Avatar/>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Info from "@/components/account/Info";
import Password from "@/components/account/Password";
import Avatar from "@/components/account/Avatar";

export default {
  components: {
    Info,
    Password,
    Avatar
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next() : next("/auth/login");
  }
};
</script>

<style>
</style>
