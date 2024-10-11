import api from '@/api'

const state = {
  alerts: []
}

const getters = {
  allAlerts: state => state.alerts
}

const actions = {
  async fetchAlerts({ commit }, params) {
    const alerts = await api.getAlerts(params)
    commit('setAlerts', alerts)
    return alerts
  },

  async resolveAlert({ commit }, alertId) {
    const resolvedAlert = await api.resolveAlert(alertId)
    commit('updateAlert', resolvedAlert)
    return resolvedAlert
  }
}

const mutations = {
  setAlerts(state, alerts) {
    state.alerts = alerts
  },
  updateAlert(state, updatedAlert) {
    const index = state.alerts.findIndex(alert => alert.id === updatedAlert.id)
    if (index !== -1) {
      state.alerts.splice(index, 1, updatedAlert)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}