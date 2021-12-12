<template>
  <nav class="overflow-hidden">
      <v-app-bar
      app
      elevation="2"
      scroll-target=""
      color="green lighten-2"
      outlined
      dense
      style="z-index:100"
      >
        <v-row align="center">
          <v-col md="2">
            <h1 class="white--text">WebID</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn fab small text v-bind="attrs" v-on="on" color="white">
                <v-icon >mdi-account-outline</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title primary-title>
                Akcje:
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text justify-center>
                <v-col cols="6" justify="center"><v-btn plain @click="$router.push({ name: 'addDocument' })"> Dodaj Dokument </v-btn></v-col>
                <v-col cols="6"><v-btn plain @click="$router.push({ name: 'documentsView' })"> Moje Dokumenty </v-btn></v-col>
                <v-col cols="12"><v-btn plain @click="$router.push({ name: 'settingsView' })"> Ustawienia </v-btn></v-col>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-row>
      </v-app-bar>
  </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>
