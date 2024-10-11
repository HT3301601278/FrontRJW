<template>
  <div class="device-management">
    <h2>反应器管理</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-button type="primary" @click="showAddDeviceDialog">添加反应器</el-button>
              <el-input
                v-model="searchQuery"
                placeholder="搜索反应器"
                style="width: 200px;"
                @input="handleSearch"
              ></el-input>
            </div>
          </template>
          <el-table :data="filteredDevices" style="width: 100%">
            <el-table-column prop="name" label="反应器名称"></el-table-column>
            <el-table-column prop="macAddress" label="MAC地址"></el-table-column>
            <el-table-column prop="communicationChannel" label="连接方式"></el-table-column>
            <el-table-column prop="isOn" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.isOn ? 'success' : 'danger'">
                  {{ scope.row.isOn ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="showDeviceDetails(scope.row)">详情</el-button>
                <el-button size="small" type="danger" @click="deleteDevice(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalElements"
          ></el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加反应器对话框 -->
    <el-dialog v-model="addDeviceDialogVisible" title="添加反应器" width="30%">
      <el-form :model="newDevice" :rules="deviceRules" ref="addDeviceFormRef">
        <el-form-item label="反应器名称" prop="name">
          <el-input v-model="newDevice.name"></el-input>
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddress">
          <el-input v-model="newDevice.macAddress"></el-input>
        </el-form-item>
        <el-form-item label="连接方式" prop="communicationChannel">
          <el-input v-model="newDevice.communicationChannel"></el-input>
        </el-form-item>
        <el-form-item label="压力阈值 (MPa)" prop="threshold">
          <el-input-number
            v-model="newDevice.threshold"
            :min="0"
            :max="100"
            :precision="2"
            :step="0.01"
            :controls="false"
            placeholder="可选，留空表示无阈值"
            class="wide-input-number"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDeviceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addDevice">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 反应器详情抽屉 -->
    <el-drawer
      v-model="deviceDetailsDrawerVisible"
      title="反应器详情"
      :with-header="false"
      size="50%"
    >
      <el-descriptions title="反应器信息" :column="1" border>
        <el-descriptions-item label="反应器名称">{{ selectedDevice.name }}</el-descriptions-item>
        <el-descriptions-item label="MAC地址">{{ selectedDevice.macAddress }}</el-descriptions-item>
        <el-descriptions-item label="连接方式">{{ selectedDevice.communicationChannel }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="selectedDevice.isOn ? 'success' : 'danger'">
            {{ selectedDevice.isOn ? '在线' : '离线' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="压力阈值 (MPa)">{{ selectedDevice.threshold }}</el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <h3>反应器控制</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="反应器开关">
            <el-switch v-model="selectedDevice.isOn" @change="toggleDevice"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="压力阈值设置 (MPa)">
            <el-input-number v-model="selectedDevice.threshold" :min="0" :max="100" :precision="2" :step="0.01" @change="setDeviceThreshold"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h3>最近数据</h3>
      <div ref="recentDataChart" style="height: 300px;"></div>
    </el-drawer>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import axios from 'axios'

export default {
  name: 'DeviceManagementView',
  setup() {
    const devices = ref([])
    const searchQuery = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalElements = ref(0)

    const filteredDevices = computed(() => {
      return devices.value.filter(device =>
        device.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        device.macAddress.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const handleSearch = () => {
      // 搜索逻辑已经通过计算属性 filteredDevices 实现
    }

    const addDeviceDialogVisible = ref(false)
    const newDevice = reactive({
      name: '',
      macAddress: '',
      communicationChannel: '',
      threshold: null,
      isOn: false
    })

    const deviceRules = {
      name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
      macAddress: [{ required: true, message: '请输入MAC地址', trigger: 'blur' }],
      communicationChannel: [{ required: true, message: '请输入通信通道', trigger: 'blur' }]
    }

    const addDeviceFormRef = ref(null)

    const showAddDeviceDialog = () => {
      addDeviceDialogVisible.value = true
    }

    const addDevice = () => {
      addDeviceFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const deviceData = { ...newDevice }
            if (deviceData.threshold === null || deviceData.threshold === '') {
              delete deviceData.threshold
            }
            const response = await axios.post('http://47.116.66.208:8080/api/devices', deviceData)
            if (response.data) {
              ElMessage.success('设备添加成功')
              addDeviceDialogVisible.value = false
              fetchDevices()
              Object.assign(newDevice, { name: '', macAddress: '', communicationChannel: '', threshold: null, isOn: false })
            }
          } catch (error) {
            console.error('添加设备失败:', error)
            ElMessage.error('添加设备失败，请稍后重试')
          }
        } else {
          return false
        }
      })
    }

    const deleteDevice = (device) => {
      ElMessageBox.confirm(
        `确定要删除设备 ${device.name} 吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        try {
          await axios.delete(`http://47.116.66.208:8080/api/devices/${device.id}`)
          ElMessage.success('设备删除成功')
          fetchDevices()
        } catch (error) {
          console.error('删除设备失败:', error)
          ElMessage.error('删除设备失败，请稍后重试')
        }
      }).catch(() => {
        // 取消删除
      })
    }

    const deviceDetailsDrawerVisible = ref(false)
    const selectedDevice = ref({})
    const recentDataChart = ref(null)

    const showDeviceDetails = (device) => {
      selectedDevice.value = { ...device }
      deviceDetailsDrawerVisible.value = true
      setTimeout(() => {
        initRecentDataChart()
      }, 0)
    }

    const toggleDevice = async (value) => {
      try {
        await axios.put(`http://47.116.66.208:8080/api/devices/${selectedDevice.value.id}`, {
          ...selectedDevice.value,
          isOn: value
        })
        ElMessage.success(`设备${value ? '开启' : '关闭'}成功`)
        fetchDevices()
      } catch (error) {
        console.error('切换设备状态失败:', error)
        ElMessage.error('切换设备状态失败，请稍后重试')
      }
    }

    const setDeviceThreshold = async (value) => {
      try {
        await axios.put(`http://47.116.66.208:8080/api/devices/${selectedDevice.value.id}`, {
          ...selectedDevice.value,
          threshold: value
        })
        ElMessage.success(`阈值设置成功：${value}`)
        fetchDevices()
      } catch (error) {
        console.error('设置设备阈值失败:', error)
        ElMessage.error('设置设备阈值失败，请稍后重试')
      }
    }

    const initRecentDataChart = () => {
      const chart = echarts.init(recentDataChart.value)
      const option = {
        title: {
          text: '最近24小时压力数据'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
        },
        yAxis: {
          type: 'value',
          name: '压力 (MPa)'
        },
        series: [{
          data: [320, 280, 250, 500, 800, 750, 600, 400],
          type: 'line',
          smooth: true
        }]
      }
      chart.setOption(option)
    }

    const fetchDevices = async () => {
      try {
        const response = await axios.get(`http://47.116.66.208:8080/api/devices?page=${currentPage.value - 1}&size=${pageSize.value}`)
        devices.value = response.data.content
        totalElements.value = response.data.totalElements
      } catch (error) {
        console.error('获取设备列表失败:', error)
        ElMessage.error('获取设备列表失败，请稍后重试')
      }
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchDevices()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchDevices()
    }

    onMounted(() => {
      fetchDevices()
    })

    return {
      devices,
      filteredDevices,
      searchQuery,
      handleSearch,
      addDeviceDialogVisible,
      newDevice,
      deviceRules,
      addDeviceFormRef,
      showAddDeviceDialog,
      addDevice,
      deleteDevice,
      deviceDetailsDrawerVisible,
      selectedDevice,
      recentDataChart,
      showDeviceDetails,
      toggleDevice,
      setDeviceThreshold,
      currentPage,
      pageSize,
      totalElements,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.device-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-divider {
  margin: 20px 0;
}

.wide-input-number {
  width: 100%;
}

.wide-input-number :deep(.el-input__inner) {
  text-align: left;
}
</style>
