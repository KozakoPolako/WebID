<template>
  <v-container class="pa-0">
    <v-tabs v-model="selTab" color="green" centered>
      <v-tab v-for="(tab, i) in tabs" :key="i">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <v-col>
      <h2>Prześlij zdjęcie {{ selTab ? "Paszportu" : "Dowodu" }}</h2>
      <file-upload
        v-show="selTab === 0"
        ref="fileUpload"
        v-model="dowodFile"
        multiple
        :filesLimit="2"
        acceptExtension=".jpg, .png"
        class="mt-4"
      ></file-upload>
      <file-upload
        v-show="selTab === 1"
        v-model="paszportFile"
        acceptExtension=".jpg, .png"
        class="mt-4"
      ></file-upload>
    </v-col>
    <v-col>
      <v-row justify="center" align="center" class="pa-3">
        <v-btn
          :disabled="isFileLoaded"
          text
          width="250"
          color="green lighten-2"
          :loading="recLoading"
          @click="selTab === 0 ? uploadDowodImage() : uploadPassportImage()"
        >
          Pobierz dane ze zdjęcia
        </v-btn>
        <v-col cols="12" md="auto" align="center"><span>Lub</span></v-col>

        <v-btn
          text
          width="250"
          color="primary"
          class="text-left"
          @click="showForm = !showForm"
          >{{ showForm ? "Schowaj" : "Pokaż" }} formularz</v-btn
        >
      </v-row>
    </v-col>
    <v-expand-transition>
      <v-tabs-items v-model="selTab" v-show="showForm">
        <v-tab-item v-for="(tab, i) in tabs" :key="i">
          <v-card>
            <v-card-text>
              <paszport-form v-if="i"></paszport-form>
              <dowod-form v-else></dowod-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-expand-transition>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import FileUpload from "../components/FileUpload.vue";
import DowodForm from "../components/DowodForm.vue";
import PaszportForm from "../components/PaszportForm.vue";
export default {
  name: "AddDocument",
  components: { FileUpload, DowodForm, PaszportForm },
  data() {
    return {
      recLoading: false,
      dowodFile: [],
      paszportFile: [],
      showForm: false,
      tabs: ["Dowód osobisty", "Paszport"],
      selTab: "mode" in this.$route.params ? this.$route.params.mode === 'paszport' ? 1 : 0 : 0,
    };
  },
  computed: {
    isFileLoaded() {
      if(this.selTab === 0)
        return !(this.dowodFile.length === 2);
      else
        return !(this.paszportFile.length === 1);
    },
  },
  watch: {
  },
  methods: {
    ...mapActions(["uploadDowodToRecognize","uploadPassportToRecognize"]),
    uploadDowodImage() {
      this.recLoading = true;
      this.uploadDowodToRecognize(this.dowodFile)
        .then(() => {
          console.log("success");
          this.showForm = true;
        })
        .catch((error) => {
          console.log("error", error);
          this.$toast.error("Nie udało się odczytać danych");
        })
        .finally(() => {
          this.recLoading = false;
        });
    },
    uploadPassportImage() {
      this.recLoading = true;
      this.uploadPassportToRecognize(this.paszportFile)
        .then(() => {
          console.log("success");
          this.showForm = true;
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          this.recLoading = false;
        });
    }
  },
};
</script>

<style></style>
