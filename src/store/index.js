import { createStore } from 'vuex'
import auth from './modules/auth'
import devices from './modules/devices'
import alerts from './modules/alerts'
import users from './modules/users'

export default createStore({
  modules: {
    auth,
    devices,
    alerts,
    users
  }
})
