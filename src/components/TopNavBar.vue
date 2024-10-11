<template>
    <div class="top-nav-bar">
      <div class="logo">农作物光强监测系统</div>
      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-icon class="user-icon"><User /></el-icon>
            {{ username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ArrowDown, User } from '@element-plus/icons-vue'
  import { useStore } from 'vuex'

  export default defineComponent({
    name: 'TopNavBar',
    components: {
      ArrowDown,
      User
    },
    setup() {
      const router = useRouter()
      const store = useStore()
      const username = ref('用户名') // 这里应该从store或API获取用户名

      const goToProfile = () => {
        router.push('/profile')
      }

      const logout = () => {
        store.dispatch('logout')
        router.push('/login')
      }

      return {
        username,
        goToProfile,
        logout
      }
    }
  })
  </script>
  
  <style scoped>
  .top-nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
  }
  
  .logo {
    font-size: 18px;
    font-weight: bold;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .el-dropdown-link {
    display: flex;
    align-items: center;
    color: #333;
    cursor: pointer;
  }
  
  .user-icon {
    margin-right: 5px;
    font-size: 20px;
  }
  </style>