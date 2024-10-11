<template>
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <h2>登录</h2>
        </template>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%;">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'Login',
    setup() {
      const store = useStore()
      const router = useRouter()
      const loginFormRef = ref(null)
      const loading = ref(false)
  
      const loginForm = reactive({
        username: '',
        password: ''
      })
  
      const rules = {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
  
      const handleLogin = () => {
        loginFormRef.value.validate(async (valid) => {
          if (valid) {
            loading.value = true
            try {
              await store.dispatch('auth/login', loginForm)
              ElMessage.success('登录成功')
              router.push('/')
            } catch (error) {
              ElMessage.error(error.response?.data?.message || '登录失败')
            } finally {
              loading.value = false
            }
          }
        })
      }
  
      return {
        loginForm,
        rules,
        loginFormRef,
        loading,
        handleLogin
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
  }
  
  .login-card {
    width: 350px;
  }
  
  .register-link {
    text-align: center;
    margin-top: 16px;
  }
  </style>