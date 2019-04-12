<template>
  <div>
    <b-card bg-variant="light" header="Validez votre statue" class="text-center shadow-sm">
      <b-card-text
        v-if="Object.entries(certificat).length != 0 || certificat.constructor != Object"
      >
        Voici les informations de votre statue:
        <span v-if="certificat.valide === 1">
          <br>Validité:
          <br>
          <span class="font-weight-bold badge badge-success text-wrap">Valide</span>
          <br>Type:
          <span class="font-weight-bold">
            <br>
            {{certificat.typec}}
          </span>
          <br>Date d'Echeance:
          <span class="font-weight-bold">
            <br>
            {{certificat.dateecheance | dateFormat}}
          </span>
        </span>

        <span v-if="certificat.valide === 0">
          <br>Validité:
          <br>
          <span class="font-weight-bold badge badge-danger text-wrap">En cours de modération</span>
        </span>
      </b-card-text>
      <b-card-text v-else>
        Vous etes un simple utilisateur, pour obtenir le statut d'Etudiant ou d'Enseignant veuillez nous envoyer une piece d'identite prouvant votre statue:
        <br>
        <b-form @submit.prevent="uploadPreuve">
          <b-form-select v-model="upload.type" :options="options" size="sm" class="mt-3"></b-form-select>
          <b-form-file
            class="mt-2"
            v-model="upload.file"
            :state="Boolean(upload.file)"
            placeholder="Choisissez un fichier..."
            drop-placeholder="Glissez un fichier..."
            accept=".jpg, .png, .jpeg"
          ></b-form-file>
          <b-button type="submit" variant="primary" class="mt-2">Envoyer</b-button>
        </b-form>
        <Alert :type="alert.type" :message="alert.message" v-if="alert.message" class="mt-2"/>
      </b-card-text>
    </b-card>
  </div>
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
      alert: {
        message: "",
        type: ""
      },
      upload: {
        file: null,
        type: null
      },
      options: [
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
    uploadPreuve() {
      alert.type = "";
      alert.message = "";
      const token = localStorage.getItem("token");

      let formData = new FormData();

      formData.append("file", this.upload.file);
      formData.append("type", this.upload.type);
      axios
        .post("/update/certificat", formData, {
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
        .get("/read/certificat", {
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

<style>
</style>
