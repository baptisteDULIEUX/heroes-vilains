import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.module'
import errors from './modules/error.module'
import secret from './modules/secret.module'
import heroes from './modules/heroes.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    errors,
    secret,
    heroes
  }
})