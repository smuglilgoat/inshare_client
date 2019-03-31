<template>
  <div>
    <b-card bg-variant="light" header="Validez votre statue" class="text-center shadow-sm">
      <b-card-text>Valider votre statue d'Etudiant ou d'Enseignant en nous envoyant une preuve</b-card-text>
      <b-button variant="primary" class="ml-auto mr-2">Etudiant</b-button>
      <b-button variant="success" class="mr-auto ml-2">Enseignant</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "DemandeRole",
  props: {
    user: {}
  }
};
</script>

<style>
</style>
