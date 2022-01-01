<template>
  <v-container>
    <v-app-bar
      fixed
      hide-on-scroll
      elevate-on-scroll
      color="white"
      class="mt-12"
      
    >
      <v-row justify="center">
        <v-col cols="12" lg="9" xl="7">
          <v-row dense justify="end" align="center">
            <v-col cols="auto" :class="$vuetify.breakpoint.lgAndUp ?  '' : 'd-none'">
              <h2 v-if="$route.params.docType === 'dowod'" >Dowod: {{ titleText }}</h2>
              <h2 v-else>Paszport: {{ titleText }}</h2>
            </v-col>
            <v-spacer />
            <v-col cols="6" lg="auto">
              <v-btn
                color="error"
                @click="deleteDialog = true"
                width="100%"
                outlined
              >
                Usuń
                <v-icon class="ml-2 my-auto" size="18"
                  >mdi-trash-can-outline</v-icon
                >
              </v-btn>
            </v-col>
            <v-col cols="6" lg="2">
              <v-btn
                v-show="!editMode"
                color="green lighten-2"
                @click="editMode = true"
                outlined
                width="100%"
              >
                Edytuj
                <v-icon class="ml-2 my-auto" size="18"
                  >mdi-pencil-outline</v-icon
                >
              </v-btn>
              <v-btn
                v-show="editMode"
                color="green lighten-2"
                @click="editMode = false"
                width="100%"
                outlined
              >
                Anuluj
                <v-icon class="ml-2 my-auto" size="18"
                  >mdi-pencil-off-outline</v-icon
                >
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
    <h2 style="margin-top:50px" :class="$vuetify.breakpoint.lgAndUp ?  'd-none' : ''">Dowod: {{ titleText }}</h2>
    <div style="height: 150px"></div>
    <dowod-form v-if="$route.params.docType === 'dowod'" :readonly.sync="readonly" />
    <passport-form v-else :readonly.sync="readonly" />
    <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>Czy napewno chcesz usunąć dokument?</v-card-title>
        <v-card-text> Operacji nie będzie można cofnąć. </v-card-text>
        <v-card-actions>
          <v-row justify="end" dense>
            <v-col cols="auto">
              <v-btn color="error" @click="$route.params.docType === 'dowod'? removeDowod() : removePassport() " plain>
                Usuń
                <v-icon class="ml-2 my-auto" size="18">
                  mdi-trash-can-outline
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn plain @click="deleteDialog = false">
                Anuluj
                <v-icon class="ml-2 my-auto" size="18">
                  mdi-close-box-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DowodForm from "../components/DowodForm.vue";
import PassportForm from "../components/PaszportForm.vue"

export default {
  name: "EditDowod",
  components: { DowodForm, PassportForm },
  data() {
    return {
      titleText: "",
      editMode: false,
      deleteDialog: false,
    };
  },
  computed: {
    ...mapGetters(["getCurrentDowod", "getCurrentPassport"]),
    readonly() {
      return !this.editMode;
    },
  },
  async mounted() {
    try {
      if(this.$route.params.docType === "dowod") {
        await this.fetchDowod(this.$route.params.docID);
        this.titleText = `${this.getCurrentDowod.dowod.names} ${this.getCurrentDowod.dowod.surname}`;
      } else  {
        await this.fetchPassport(this.$route.params.docID);
        this.titleText = `${this.getCurrentPassport.passport.names} ${this.getCurrentPassport.passport.surname}`;
      }
      
    } catch (error) {
      console.log(error);
      this.$toast.error("Nie udało się pobrać dokumentu");
    }
  },
  methods: {
    ...mapActions(["fetchDowod", "deleteDowod", "fetchPassport", "deletePassport"]),
    test() {
      this.$toast.success("test");
    },
    async removeDowod() {
      try {
        await this.deleteDowod(this.$route.params.docID);
        this.$toast.success("Usunięto dokument");
        this.$router.push({ name: "documentsView" });
      } catch (error) {
        this.$toast.error("Nie udało się usunąć dokumentu");
      }
    },
    async removePassport() {
      try {
        await this.deletePassport(this.$route.params.docID);
        this.$toast.success("Usunięto dokument");
        this.$router.push({ name: "documentsView" });
      } catch (error) {
        this.$toast.error("Nie udało się usunąć dokumentu");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.docEdit {
  background-color: lightgrey;
}
</style>
