import api from '@/api'

const state = {
  devices: []
}

const getters = {
  allDevices: state => state.devices
}

const actions = {
  async fetchDevices({ commit }) {
    const devices = await api.getDevices()
    commit('setDevices', devices)
    return devices
  },

  async addDevice({ commit }, deviceData) {
    const device = await api.addDevice(deviceData)
    commit('addDevice', device)
    return device
  },

  async updateDevice({ commit }, deviceData) {
    const device = await api.updateDevice(deviceData)
    commit('updateDevice', device)
    return device
  },

  async deleteDevice({ commit }, deviceId) {
    await api.deleteDevice(deviceId)
    commit('deleteDevice', deviceId)
  },

  async toggleDevice({ commit }, deviceId) {
    const updatedDevice = await api.toggleDevice(deviceId)
    commit('updateDevice', updatedDevice)
    return updatedDevice
  }
}

const mutations = {
  setDevices(state, devices) {
    state.devices = devices
  },
  addDevice(state, device) {
    state.devices.push(device)
  },
  updateDevice(state, updatedDevice) {
    const index = state.devices.findIndex(device => device.id === updatedDevice.id)
    if (index !== -1) {
      state.devices.splice(index, 1, updatedDevice)
    }
  },
  deleteDevice(state, deviceId) {
    state.devices = state.devices.filter(device => device.id !== deviceId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}