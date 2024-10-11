<template>
  <el-container v-if="isLoggedIn && !isLoginOrRegister">
    <el-aside width="200px">
      <SideMenu />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
  <router-view v-else />
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SideMenu from '@/components/SideMenu.vue'
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    SideMenu,
    Header
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
    const isLoginOrRegister = computed(() => {
      return route.name === 'Login' || route.name === 'Register'
    })

    return {
      isLoggedIn,
      isLoginOrRegister
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
}
</style>
