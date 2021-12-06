import Vue from 'vue'
import Vuex from 'vuex'
import servicio from "../services/NewsService.js"

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state:{
    message2: []
  },
  mutations: {
    SET_MESSAGE(state, message2){
      state.message2 = message2;
    }
  },
  actions: {
    async insertNews({state, commit, rootGetters}, ...news){
      servicio.insertNews(...news);
    },
    set_Message2({ commit }, message2){
      commit("SET_MESSAGE",message2, {root: true});
    }
  },
  getters: {
    get_Message2(state){
      return state.message2;
    }
  },
  modules: {
  }
})
