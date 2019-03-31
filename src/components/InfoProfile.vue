<template>
  <div>
    <b-card bg-variant="light" header="Profile" class="text-center shadow-sm">
      <b-card-text>
        <b-container fluid>
          <b-row>
            <b-col></b-col>
            <b-col>
              <b-row>
                Username:
                <span class="font-weight-bold">
                  <br>
                  {{user.username}}
                </span>
              </b-row>
              <b-row>
                Email:
                <span class="font-weight-bold">
                  <br>
                  {{user.email}}
                </span>
              </b-row>
              <b-row v-if="user.role">
                Role:
                <span class="font-weight-bold">
                  <br>
                  {{user.role}}
                </span>
              </b-row>
            </b-col>
            <b-col v-if="user.domaine || user.niveauetud || user.niveauense">
              <b-row v-if="user.domaine">
                Domaine:
                <span class="font-weight-bold">
                  <br>
                  {{user.domaine}}
                </span>
              </b-row>
              <b-row v-if="user.niveauetud">
                Niveau:
                <span class="font-weight-bold">
                  <br>
                  {{user.niveauetud}}
                </span>
              </b-row>
              <b-row v-else-if="user.niveauense">
                Niveau:
                <span class="font-weight-bold">
                  <br>
                  {{user.niveauense}}
                </span>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "InfoProfile",
  props: {
    user: {}
  }
};
</script>

<style scoped>
</style>
