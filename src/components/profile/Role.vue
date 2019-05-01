<template>
  <v-card>
    <v-toolbar card flat dense color="info">
      <v-toolbar-title>Certification</v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-md text-xs-center fill-height class="pa-0">
      <v-layout row wrap align-center>
        <v-flex grow d-flex>
          <v-card flat>
            <v-card-text
              v-if="Object.entries(certificat).length != 0 || certificat.constructor != Object"
            >
              Voici les informations de votre statue:
              <v-container
                fluid
                grid-list-md
                text-xs-center
                v-if="certificat.valide === 1"
                class="pa-0"
              >
                <v-layout row wrap>
                  <v-flex>
                    <v-layout column align-start justify-start fill-height>
                      <v-flex>Validite</v-flex>
                      <v-flex>Type</v-flex>
                      <v-flex>Date d'écheance</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout column align-end justify-start fill-height>
                      <v-flex>
                        <v-chip color="success" text-color="white">Valide</v-chip>
                      </v-flex>
                      <v-flex>
                        <v-chip>{{certificat.typec}}</v-chip>
                      </v-flex>
                      <v-flex>
                        <v-chip>{{certificat.dateecheance | dateFormat}}</v-chip>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-container
                fluid
                grid-list-md
                text-xs-center
                v-if="certificat.valide === 0"
                class="pa-0"
              >
                <v-layout row wrap>
                  <v-flex>
                    <v-layout column align-start justify-start fill-height>
                      <v-flex>Validite</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout column align-end justify-start fill-height>
                      <v-flex>
                        <v-chip color="warning">En cours de modération</v-chip>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-text v-else>
              Vous etes un simple utilisateur, pour obtenir le statut d'Etudiant ou d'Enseignant veuillez nous envoyer une piece d'identite prouvant votre statue:
              <br>
              <v-form>
                <v-select
                  prepend-icon="insert_drive_file"
                  :items="items"
                  label="Type"
                  v-model="upload.type"
                ></v-select>
                <v-text-field
                  label="Preuve"
                  v-model="imageName"
                  @click="pickFile"
                  prepend-icon="attach_file"
                ></v-text-field>
                <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="onFilePicked"
                >
              </v-form>
              <v-btn color="primary" @click="uploadPreuve">Envoyer</v-btn>
              <Alert :type="alert.type" :message="alert.message" v-if="alert.message" class="mt-2"/>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import Alert from "@/components/Alert";
var moment = require("moment");

export default {
  name: "Role",
  components: {
    Alert
  },
  filters: {
    dateFormat: function(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
  data() {
    return {
      imageName: "",
      alert: {
        message: "",
        type: ""
      },
      upload: {
        file: null,
        type: null
      },
      items: [
        { value: "Badge", text: "Badge" },
        { value: "Certificat de Scolarite", text: "Certificat de Scolarite" },
        { value: "Contrat de Travail", text: "Contrat de Travail" }
      ],
      certificat: {}
    };
  },
  props: {
    user: {}
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        this.upload.file = files[0];
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
      }
    },
    uploadPreuve() {
      alert.type = "";
      alert.message = "";
      const token = localStorage.getItem("token");

      let formData = new FormData();

      formData.append("file", this.upload.file);
      formData.append("type", this.upload.type);
      axios
        .post("/certificats", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
          this.alert = Object.assign({}, this.alert, {
            message: error.response.data.message,
            type: "danger"
          });
        });
    },
    fetchCertificat() {
      const token = localStorage.getItem("token");

      axios
        .get("/certificats/" + this.user.id, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          if (data) {
            this.certificat = data;
          }
        });
    }
  },
  created() {
    this.fetchCertificat();
  }
};
</script>
