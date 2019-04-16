<template>
  <v-card>
    <v-toolbar card flat dense color="primary">
      <v-toolbar-title>Profile</v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-md text-xs-center fill-height>
      <v-layout row wrap align-center>
        <v-flex grow d-flex>
          <v-card flat>
            <v-card-text>
              <strong>Avatar</strong>
              <br>
              <v-avatar size="150px" color="grey lighten-4">
                <img :src="user.avatar" alt="alt">
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex grow d-flex>
          <v-layout row wrap align-center justify-space-around column fill-height>
            <v-flex>
              <v-card flat>
                <v-card-text class="py-2 my-1">
                  <strong>Utilisateur</strong>
                  <br>
                  {{user.username}}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex>
              <v-card flat>
                <v-card-text class="py-2 my-1">
                  <strong>Email</strong>
                  <br>
                  {{user.email}}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex>
              <v-card flat>
                <v-card-text class="py-2 my-1">
                  <strong>Rôle</strong>
                  <br>
                  {{user.role}}
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex grow d-flex v-if="user.domaine">
          <v-layout row wrap align-center justify-space-around column fill-height>
            <v-flex>
              <v-card flat>
                <v-card-text class="py-2 my-1">
                  <strong>Domaine</strong>
                  <br>
                  {{user.domaine}}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex>
              <v-card flat>
                <v-card-text class="py-2 my-1">
                  <strong>Niveau</strong>
                  <br>
                  {{user.niveau}}
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "Info",
  props: {
    user: {}
  }
};
</script>