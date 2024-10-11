<template>
  <div class="change-password">
    <h2>修改密码</h2>
    <el-form :model="passwordForm" :rules="rules" ref="passwordFormRef" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'ChangePassword',
  setup() {
    const store = useStore()
    const passwordFormRef = ref(null)

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const rules = {
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
      ]
    }

    const submitForm = () => {
      passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            await store.dispatch('auth/changePassword', passwordForm)
            ElMessage.success('密码修改成功')
            passwordFormRef.value.resetFields()
          } catch (error) {
            ElMessage.error('密码修改失败')
          }
        }
      })
    }

    return {
      passwordForm,
      passwordFormRef,
      rules,
      submitForm
    }
  }
}
</script>

<style scoped>
.change-password {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
</style>
