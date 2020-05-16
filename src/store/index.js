import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    userInfo: null
  },
  mutations: {
    setUser(state, payload){
      state.user = payload.user
    },
    setUserInfo(state, payload){
      state.userInfo = payload.userInfo
    },
  },
  actions: {
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getUserInfo: state => {
      return state.userInfo
    },
  },
  modules: {
  }
})
