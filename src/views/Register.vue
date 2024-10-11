<template>
    <div class="register-container">
      <el-card class="register-card">
        <template #header>
          <h2>注册</h2>
        </template>
        <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="密码">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%;">注册</el-button>
          </el-form-item>
        </el-form>
        <div class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
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
    name: 'Register',
    setup() {
      const store = useStore()
      const router = useRouter()
      const registerFormRef = ref(null)
      const loading = ref(false)
  
      const registerForm = reactive({
        username: '',
        password: '',
        confirmPassword: ''
      })
  
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
  
      const rules = {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
  
      const handleRegister = () => {
        registerFormRef.value.validate(async (valid) => {
          if (valid) {
            loading.value = true
            try {
              await store.dispatch('auth/register', {
                username: registerForm.username,
                password: registerForm.password
              })
              ElMessage.success('注册成功')
              router.push('/login')
            } catch (error) {
              ElMessage.error(error.response?.data?.message || '注册失败')
            } finally {
              loading.value = false
            }
          }
        })
      }
  
      return {
        registerForm,
        rules,
        registerFormRef,
        loading,
        handleRegister
      }
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
  }
  
  .register-card {
    width: 350px;
  }
  
  .login-link {
    text-align: center;
    margin-top: 16px;
  }
  </style>