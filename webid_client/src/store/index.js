import Vue from 'vue'
import Vuex from 'vuex'
import dokumenty from '@/store/modules/dokumenty'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dokumenty
  }
})
