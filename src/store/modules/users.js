import api from '@/api'

const state = {
  users: []
}

const getters = {
  allUsers: state => state.users
}

const actions = {
  async fetchUsers({ commit }) {
    const users = await api.getUsers()
    commit('setUsers', users)
    return users
  },

  async addUser({ commit }, userData) {
    const user = await api.addUser(userData)
    commit('addUser', user)
    return user
  },

  async updateUser({ commit }, userData) {
    const user = await api.updateUser(userData)
    commit('updateUser', user)
    return user
  },

  async deleteUser({ commit }, userId) {
    await api.deleteUser(userId)
    commit('deleteUser', userId)
  }
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  addUser(state, user) {
    state.users.push(user)
  },
  updateUser(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  deleteUser(state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}