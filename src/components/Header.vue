<template>
    <div class="header">
      <h2>反应器压力在线监测系统</h2>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'Header',
    setup() {
      const store = useStore()
      const router = useRouter()
      const username = computed(() => store.state.auth.user?.username || '未登录')
  
      const handleCommand = (command) => {
        if (command === 'changePassword') {
          router.push('/change-password')
        } else if (command === 'logout') {
          store.dispatch('auth/logout')
          router.push('/login')
        }
      }
  
      return {
        username,
        handleCommand
      }
    }
  }
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  </style>