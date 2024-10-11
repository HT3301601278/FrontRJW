import api from '@/api'

const state = {
  user: null,
  token: localStorage.getItem('token') || null
}

const getters = {
  isLoggedIn: state => !!state.token,
  currentUser: state => state.user,
  isAdmin: state => state.user && state.user.role === 'admin'
}

const actions = {
  async login({ commit }, credentials) {
    const response = await api.login(credentials)
    commit('setUser', response)
    commit('setToken', response.id.toString())
    localStorage.setItem('token', response.id.toString())
  },

  async register({ commit }, userData) {
    const response = await api.register(userData)
    commit('setUser', response)
    commit('setToken', response.id.toString())
    localStorage.setItem('token', response.id.toString())
  },

  async logout({ commit }) {
    commit('setUser', null)
    commit('setToken', null)
    localStorage.removeItem('token')
  },

  async fetchCurrentUser({ commit }) {
    const user = await api.getCurrentUser()
    commit('setUser', user)
  },

  async changePassword({ commit }, passwordData) {
    await api.changePassword(passwordData)
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setToken(state, token) {
    state.token = token
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}