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
        v-model="uploadFile"
        acceptExtension=".jpg, .png"
      ></file-upload>
    </v-col>
    <v-col>
      <v-row justify="center" align="center" class="pa-3">
        <v-btn
          :disabled="isFileLoaded"
          text
          width="250"
          color="green lighten-2"
          @click="uploadImage"
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
      uploadFile: [],
      showForm: false,
      tabs: ["Dowód osobisty", "Paszport"],
      selTab: null,
      table: ["Start", "test123", "testowy dłuższy tekst tekstowy"],
    };
  },
  computed: {
    isFileLoaded() {
      return !this.uploadFile.length;
    },
  },
  methods: {
    ...mapActions(["uploadDowodToRecognize"]),
    uploadImage() {
      this.uploadDowodToRecognize(this.uploadFile[0])
        .then(() => {
          console.log("success");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  updated() {
    console.log("dokumenty", this.uploadFile);
  },
};
</script>

<style></style>
