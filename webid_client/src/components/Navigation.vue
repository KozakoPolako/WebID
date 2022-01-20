<template>
  <nav class="overflow-hidden">
    <v-app-bar
      app
      elevation="2"
      scroll-target=""
      color="green lighten-2"
      outlined
      dense
      style="z-index: 100"
    >
      <v-row align="center">
        <v-col md="2">
          <h1 class="white--text">WebID</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab small text v-bind="attrs" v-on="on" color="white">
              <v-icon>mdi-account-outline</v-icon>
            </v-btn>
          </template>
          <v-card class="">
            <v-card-title class="pa-3 py-2" primary-title>
              <v-col cols="12" class="pa-0">
                {{ this.$keycloak.tokenParsed["preferred_username"] }}
              </v-col>
              <v-spacer></v-spacer>
              <v-chip
                v-if="
                  $keycloak.resourceAccess['webid-client'].roles.includes(
                    'admin'
                  )
                "
                x-small
              >
                Administrator
              </v-chip>
              <v-chip
                class="ml-2"
                v-if="
                  $keycloak.resourceAccess['webid-client'].roles.includes(
                    'user'
                  )
                "
                x-small
              >
                Użytkownik
              </v-chip>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <!-- <v-chip v-if="$keycloak.resourceAccess['webid-client'].roles.includes('user')">Użytkownik</v-chip> -->

            <v-card-text justify-center class="pt-3">
              <v-col
                cols="6"
                justify="center"
                class="pa-0"
                v-if="
                  $keycloak.resourceAccess['webid-client'].roles.includes(
                    'user'
                  )
                "
                ><v-btn plain @click="$router.push({ name: 'addDocument' })">
                  Dodaj Dokument
                </v-btn></v-col
              >
              <v-col cols="6" class="pa-0"
                ><v-btn plain @click="$router.push({ name: 'documentsView' })">
                  Moje Dokumenty
                </v-btn></v-col
              >
              <v-col
                cols="12"
                class="px-0 pt-0"
                v-if="
                  $keycloak.resourceAccess['webid-client'].roles.includes(
                    'admin'
                  )
                "
                ><v-btn plain @click="$router.push({ name: 'settingsView' })">
                  Ustawienia
                </v-btn></v-col
              >
              <v-col cols="12" class="px-0 pt-1 pb-3"
                ><v-btn
                  width="100%"
                  color="green lighten-2"
                  class="white--text"
                  @click="accSettings"
                >
                  Zarządzaj kontem
                </v-btn></v-col
              >
              <v-col cols="12" class="pa-0"
                ><v-btn
                  width="100%"
                  color="green lighten-2"
                  outlined
                  @click="this.$keycloak.logout"
                >
                  Wyloguj
                </v-btn></v-col
              >
            </v-card-text>
          </v-card>
        </v-menu>
      </v-row>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  methods: {
    accSettings() {
      window.location.href = `http://localhost:8070/auth/realms/WebID/account?referrer=${this.$keycloak.clientId}&referrer_uri=${window.location.href}`;
    },
  },
};
</script>

<style></style>
