<template>
  <div class="profile">
    <h2>个人中心</h2>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useStore } from 'vuex'

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore()
    const passwordFormRef = ref(null)

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const changePassword = () => {
      passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.put(
              `http://47.116.66.208:8080/api/users/${store.state.user.id}/password`,
              null,
              {
                params: {
                  oldPassword: passwordForm.oldPassword,
                  newPassword: passwordForm.newPassword
                }
              }
            )
            if (response.data && response.data.id) {
              ElMessage.success('密码已成功修改')
              passwordForm.oldPassword = ''
              passwordForm.newPassword = ''
              passwordForm.confirmPassword = ''
            } else {
              ElMessage.error('密码修改失败，请稍后重试')
            }
          } catch (error) {
            console.error('修改密码错误:', error)
            if (error.response && error.response.status === 400) {
              ElMessage.error('旧密码不正确')
            } else {
              ElMessage.error('密码修改失败，请稍后重试')
            }
          }
        } else {
          return false
        }
      })
    }

    return {
      passwordForm,
      passwordRules,
      passwordFormRef,
      changePassword
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card {
  margin-bottom: 20px;
}
</style>