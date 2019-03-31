<template>
  <div>
    <b-card no-body class="ml-2 mr-2">
      <b-tabs pills card vertical>
        <b-tab title="Changer vos indentifiants" active>
          <b-card-text>
            <ModifInfo/>
          </b-card-text>
        </b-tab>
        <b-tab title="Changer votre mot de passe">
          <b-card-text>
            <ModifMdp/>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import ModifInfo from "@/components/ModifInfo";
import ModifMdp from "@/components/ModifMdp";

export default {
  components: {
    ModifInfo,
    ModifMdp
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("token");

    return token ? next() : next("/auth/connexion");
  }
};
</script>

<style>
</style>
