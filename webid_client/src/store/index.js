import Vue from 'vue'
import Vuex from 'vuex'
import dokumenty from '@/store/modules/dokumenty'
import dowodValidation from '@/store/modules/validationRules/dowod'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dokumenty,
    dowodValidation
  }
})
