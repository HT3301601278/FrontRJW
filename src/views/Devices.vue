<template>
    <div class="devices">
      <h2>设备管理</h2>
      <el-button type="primary" @click="dialogVisible = true">添加设备</el-button>
      <el-table :data="devices" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="macAddress" label="MAC地址" />
        <el-table-column prop="communicationChannel" label="通信通道" />
        <el-table-column prop="threshold" label="阈值" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editDevice(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteDevice(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑设备' : '添加设备'">
        <el-form :model="deviceForm" :rules="rules" ref="deviceFormRef">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="deviceForm.name" />
          </el-form-item>
          <el-form-item label="MAC地址" prop="macAddress">
            <el-input v-model="deviceForm.macAddress" />
          </el-form-item>
          <el-form-item label="通信通道" prop="communicationChannel">
            <el-select v-model="deviceForm.communicationChannel">
              <el-option label="WiFi" value="WiFi" />
              <el-option label="Bluetooth" value="Bluetooth" />
            </el-select>
          </el-form-item>
          <el-form-item label="阈值" prop="threshold">
            <el-input-number v-model="deviceForm.threshold" :min="0" :max="1000" />
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
    name: 'Devices',
    setup() {
      const store = useStore()
      const devices = ref([])
      const dialogVisible = ref(false)
      const isEdit = ref(false)
      const deviceFormRef = ref(null)
  
      const deviceForm = reactive({
        id: null,
        name: '',
        macAddress: '',
        communicationChannel: '',
        threshold: 0
      })
  
      const rules = {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        macAddress: [{ required: true, message: '请输入MAC地址', trigger: 'blur' }],
        communicationChannel: [{ required: true, message: '请选择通信通道', trigger: 'change' }],
        threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }]
      }
  
      const fetchDevices = async () => {
        try {
          const response = await store.dispatch('devices/fetchDevices')
          devices.value = response
        } catch (error) {
          ElMessage.error('获取设备列表失败')
        }
      }
  
      const editDevice = (device) => {
        isEdit.value = true
        Object.assign(deviceForm, device)
        dialogVisible.value = true
      }
  
      const deleteDevice = (device) => {
        ElMessageBox.confirm(`确定要删除设备 ${device.name} 吗？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await store.dispatch('devices/deleteDevice', device.id)
            ElMessage.success('删除设备成功')
            fetchDevices()
          } catch (error) {
            ElMessage.error('删除设备失败')
          }
        }).catch(() => {})
      }
  
      const submitForm = () => {
        deviceFormRef.value.validate(async (valid) => {
          if (valid) {
            try {
              if (isEdit.value) {
                await store.dispatch('devices/updateDevice', deviceForm)
                ElMessage.success('更新设备成功')
              } else {
                await store.dispatch('devices/addDevice', deviceForm)
                ElMessage.success('添加设备成功')
              }
              dialogVisible.value = false
              fetchDevices()
            } catch (error) {
              ElMessage.error(isEdit.value ? '更新设备失败' : '添加设备失败')
            }
          }
        })
      }
  
      onMounted(fetchDevices)
  
      return {
        devices,
        dialogVisible,
        isEdit,
        deviceForm,
        deviceFormRef,
        rules,
        editDevice,
        deleteDevice,
        submitForm
      }
    }
  }
  </script>
  
  <style scoped>
  .devices {
    padding: 20px;
  }
  </style>