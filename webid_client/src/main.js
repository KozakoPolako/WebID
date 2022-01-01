import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import toast from "vue-toastification";
import VueLogger from "vuejs-logger";
import Keycloak from "keycloak-js";
import VueMask from "v-mask";
import VueAuthImage from "vue-auth-image"

import "vue-toastification/dist/index.css";


Vue.config.productionTip = false;

const options = {
  isEnabled: true,
  logLevel: "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true,
};

const initOptions = {
  url: "http://localhost:8070/auth",
  realm: "WebID",
  clientId: "webid-client",
  onLoad: "login-required",
};

Vue.use(VueLogger, options);
Vue.use(VueAuthImage)
const keycloak = Keycloak(initOptions);

Vue.prototype.$keycloak = keycloak;

keycloak
  .init({ onLoad: initOptions.onLoad })
  .then((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      tokenInterceptor();
      Vue.$log.info("Authenticated");
    }
    new Vue({
      store,
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
    localStorage.setItem("vue-token", keycloak.token);
    localStorage.setItem("vue-refresh-token", keycloak.refreshToken);
    function tokenInterceptor() {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
    setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            Vue.$log.debug(`Token refreshed${refreshed}`);
          } else {
            Vue.$log.warn(
              `Token not refreshed, valid for ${Math.round(
                keycloak.tokenParsed.exp +
                  keycloak.timeSkew -
                  new Date().getTime() / 1000
              )} seconds`
            );
          }
        })
        .catch(() => {
          Vue.$log.error("Failed to refresh token");
        });
    }, 60000);
  })
  .catch(() => {
    Vue.$log.error("Authenticated Failed");
  });

const toastOptions = {
  position: "bottom-right",
};

Vue.use(toast, toastOptions);

Vue.use(VueMask);

axios.interceptors.response.use(
  response => {
      return Promise.resolve(response)
  },
  error => {
      const { status } = error.response
      if (status === 403 || status === 401) {
          router.push({name: "unauthorized"})
      }
      return Promise.reject(error)
  },
)

