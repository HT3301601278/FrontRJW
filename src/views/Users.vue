<template>
    <div class="users">
      <h2>用户管理</h2>
      <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
      <el-table :data="users" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'">
        <el-form :model="userForm" :rules="rules" ref="userFormRef">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="!isEdit">
            <el-input v-model="userForm.password" type="password" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="userForm.role">
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  export default {
    name: 'Users',
    setup() {
      const store = useStore()
      const users = ref([])
      const dialogVisible = ref(false)
      const isEdit = ref(false)
      const userFormRef = ref(null)
  
      const userForm = reactive({
        id: null,
        username: '',
        password: '',
        role: 'user'
      })
  
      const rules = {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
  
      const fetchUsers = async () => {
        try {
          const response = await store.dispatch('users/fetchUsers')
          users.value = response
        } catch (error) {
          ElMessage.error('获取用户列表失败')
        }
      }
  
      const editUser = (user) => {
        isEdit.value = true
        Object.assign(userForm, user)
        dialogVisible.value = true
      }
  
      const deleteUser = (user) => {
        ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await store.dispatch('users/deleteUser', user.id)
            ElMessage.success('删除用户成功')
            fetchUsers()
          } catch (error) {
            ElMessage.error('删除用户失败')
          }
        }).catch(() => {})
      }
  
      const submitForm = () => {
        userFormRef.value.validate(async (valid) => {
          if (valid) {
            try {
              if (isEdit.value) {
                await store.dispatch('users/updateUser', userForm)
                ElMessage.success('更新用户成功')
              } else {
                await store.dispatch('users/addUser', userForm)
                ElMessage.success('添加用户成功')
              }
              dialogVisible.value = false
              fetchUsers()
            } catch (error) {
              ElMessage.error(isEdit.value ? '更新用户失败' : '添加用户失败')
            }
          }
        })
      }
  
      onMounted(fetchUsers)
  
      return {
        users,
        dialogVisible,
        isEdit,
        userForm,
        userFormRef,
        rules,
        editUser,
        deleteUser,
        submitForm
      }
    }
  }
  </script>
  
  <style scoped>
  .users {
    padding: 20px;
  }
  </style>