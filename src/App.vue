<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

export default {
  name: 'App',
  components: {
    ElConfigProvider,
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    onMounted(() => {
      if (!store.state.isAuthenticated && router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    })

    return {
      zhCn,
    }
  },
}
</script>

<style>
@import 'element-plus/dist/index.css';

body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100vh;
}

/* 全局蓝色主题样式 */
:root {
  --el-color-primary: #1e88e5;
}

.el-button--primary {
  --el-button-bg-color: #1e88e5;
  --el-button-border-color: #1e88e5;
}

.el-button--primary:hover {
  --el-button-hover-bg-color: #1976d2;
  --el-button-hover-border-color: #1976d2;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1e88e5;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom-color: #1e88e5;
}
</style>