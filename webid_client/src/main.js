import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import toast from "vue-toastification";
import VueMask from 'v-mask'
import "vue-toastification/dist/index.css";
Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

const options = {
  position: 'bottom-right'
}

Vue.use(toast, options)
Vue.use(VueMask)
