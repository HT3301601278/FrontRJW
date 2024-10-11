<template>
    <div class="dashboard">
      <h2>实时监控</h2>
      <el-row :gutter="20">
        <el-col :span="8" v-for="device in devices" :key="device.id">
          <el-card class="device-card">
            <template #header>
              <div class="card-header">
                <span>{{ device.name }}</span>
                <el-switch
                  v-model="device.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="toggleDevice(device)"
                />
              </div>
            </template>
            <div class="device-info">
              <p>MAC地址: {{ device.macAddress }}</p>
              <p>通信通道: {{ device.communicationChannel }}</p>
              <p>当前压力: {{ device.currentPressure }} MPa</p>
              <p>阈值: {{ device.threshold }} MPa</p>
            </div>
            <el-progress
              :percentage="(device.currentPressure / device.threshold) * 100"
              :status="device.currentPressure > device.threshold ? 'exception' : 'success'"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'Dashboard',
    setup() {
      const store = useStore()
      const devices = ref([])
  
      const fetchDevices = async () => {
        try {
          const response = await store.dispatch('devices/fetchDevices')
          devices.value = response
        } catch (error) {
          ElMessage.error('获取设备列表失败')
        }
      }
  
      const toggleDevice = async (device) => {
        try {
          await store.dispatch('devices/toggleDevice', device.id)
          ElMessage.success(`${device.name} 状态已更新`)
        } catch (error) {
          ElMessage.error('更新设备状态失败')
          device.status = !device.status // 恢复原状态
        }
      }
  
      onMounted(fetchDevices)
  
      return {
        devices,
        toggleDevice
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  
  .device-card {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .device-info {
    margin-bottom: 15px;
  }
  </style>