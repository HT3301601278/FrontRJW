import axios from 'axios'

const api = axios.create({
  baseURL: 'http://47.116.66.208:8080/api'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default {
  // 认证相关
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getCurrentUser: () => api.get('/users/current'),

  // 设备相关
  getDevices: () => api.get('/devices'),
  addDevice: (deviceData) => api.post('/devices', deviceData),
  updateDevice: (deviceData) => api.put(`/devices/${deviceData.id}`, deviceData),
  deleteDevice: (deviceId) => api.delete(`/devices/${deviceId}`),
  toggleDevice: (deviceId) => api.post(`/devices/${deviceId}/toggle`),

  // 警报相关
  getAlerts: (params) => api.get('/alerts', { params }),
  resolveAlert: (alertId) => api.post(`/alerts/${alertId}/resolve`),

  // 用户管理相关
  getUsers: () => api.get('/users'),
  addUser: (userData) => api.post('/users', userData),
  updateUser: (userData) => api.put(`/users/${userData.id}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),

  // 密码管理相关
  changePassword: (passwordData) => api.post('/users/change-password', passwordData)
}