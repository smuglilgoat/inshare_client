<template>
  <div>
    <h1>Certificats en attente de validation</h1>
    <b-container fluid>
      <b-row>
        <b-col cols="8">
          <b-table
            id="certifTable"
            selectable
            select-mode="single"
            @row-selected="rowSelected"
            striped
            hover
            small
            responsive
            :items="certificatsAttente"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            :busy="isBusy"
          >
            <div slot="table-busy" class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="ml-2">Chargement...</strong>
            </div>
            <template slot="user_id" slot-scope="data">{{users.get(data.value)}}</template>
            <template slot="preuve" slot-scope="data">
              <a :href="`${data.value}`" target="_blank">Cliquez</a>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="certifTable"
            align="fill"
          ></b-pagination>
        </b-col>
        <b-col cols="4">
          <b-card>
            <b-card-text v-if="selected != null">
              ID:
              <span class="font-weight-bold">{{selected[0].id}}</span>
              <br>Utilisateur:
              <span class="font-weight-bold">{{users.get(selected[0].user_id)}}</span>
              <br>Date d'Echenace:
              <datepicker
                :language="fr"
                bootstrap-styling
                full-month-name
                v-model="date"
                :format="dateFormat"
              ></datepicker>
            </b-card-text>
            <b-card-text v-else style=" opacity: 0.6">
              <b-spinner type="grow" class="mr-2 align-middle"></b-spinner>
              <strong>Selectionnez un certificat...</strong>
            </b-card-text>

            <b-button
              variant="primary"
              class="mr-2"
              v-if="selected != null"
              @click="updateCertificat"
            >
              <i class="fas fa-folder-plus"></i>
            </b-button>
            <b-button variant="danger" v-if="selected != null" @click="refuseCertificat">
              <i class="fas fa-folder-minus"></i>
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <hr>
    <h1>Certificats validés</h1>
    <b-table
      id="certifTableValide"
      striped
      hover
      small
      responsive
      :items="certificatsValide"
      :fields="fieldsValide"
      :per-page="perPageValide"
      :current-page="currentPageValide"
      :busy="isBusyValide"
    >
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong class="ml-2">Chargement...</strong>
      </div>
      <template slot="user_id" slot-scope="data">{{users.get(data.value)}}</template>
      <template slot="preuve" slot-scope="data">
        <a :href="`${data.value}`" target="_blank">Cliquez</a>
      </template>
      <template slot="dateecheance" slot-scope="data">{{data.value}}</template>
    </b-table>
    <b-pagination
      v-model="currentPageValide"
      :total-rows="rowsValide"
      :per-page="perPageValide"
      aria-controls="certifTableValide"
      align="fill"
    ></b-pagination>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";
var moment = require("moment");

export default {
  components: {
    Datepicker
  },
  name: "Certificats",
  data() {
    return {
      fr: fr,
      date: new Date(),
      selected: null,
      isBusy: true,
      isBusyValide: true,
      perPage: 5,
      currentPage: 1,
      rows: 0,
      perPageValide: 5,
      currentPageValide: 1,
      rowsValide: 0,
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true
        },
        {
          key: "user_id",
          label: "ID Utilisateur",
          sortable: true
        },
        {
          key: "typec",
          label: "Type",
          sortable: true
        },
        {
          key: "preuve",
          label: "Fichier",
          sortable: true
        }
      ],
      fieldsValide: [
        {
          key: "id",
          label: "ID",
          sortable: true
        },
        {
          key: "user_id",
          label: "ID Utilisateur",
          sortable: true
        },
        {
          key: "typec",
          label: "Type",
          sortable: true
        },
        {
          key: "preuve",
          label: "Fichier",
          sortable: true
        },
        {
          key: "dateecheance",
          label: "Date d'écheance",
          sortable: true,
          formatter: (value, key, item) => {
            return moment(item.value).format("YYYY-MM-DD");
          }
        }
      ],
      certificatsAttente: [],
      certificatsValide: [],
      users: new Map()
    };
  },
  mounted() {
    this.fetchCertificats();
    this.fetchUsers();
  },
  methods: {
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    rowSelected(items) {
      this.selected = items;
    },
    refuseCertificat() {
      axios
        .delete("/update/certificat", {
          data: { user_id: this.selected[0].user_id }
        })
        .then(() => {
          this.$router.go();
        });
    },
    updateCertificat() {
      axios
        .put("/update/certificat", {
          user_id: this.selected[0].user_id,
          date: moment(this.date).format("YYYY-MM-DD")
        })
        .then(() => {
          this.$router.go();
        });
    },
    fetchCertificats() {
      const token = localStorage.getItem("token");

      axios
        .get("/view/certificats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          data.forEach(e => {
            if (e.valide == 0) {
              this.certificatsAttente.push(e);
              this.rows = this.certificatsAttente.length;
            } else {
              this.certificatsValide.push(e);
              this.rowsValide = this.certificatsValide.length;
            }
          });
        });
    },
    fetchUsers() {
      const token = localStorage.getItem("token");

      axios
        .get("/view/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          data.forEach(e => {
            this.users.set(e.id, e.username);
          });
          this.isBusy = !this.isBusy;
          this.isBusyValide = !this.isBusyValide;
        });
    }
  }
};
</script>

<style>
</style>
