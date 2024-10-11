<template>
    <div class="alerts">
      <h2>警报管理</h2>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="设备">
          <el-select v-model="queryForm.deviceId" placeholder="选择设备">
            <el-option label="全部" value="" />
            <el-option v-for="device in devices" :key="device.id" :label="device.name" :value="device.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchAlerts">查询</el-button>
        </el-form-item>
      </el-form>
  
      <el-table :data="alerts" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="alertTime" label="警报时间" />
        <el-table-column prop="value" label="压力值" />
        <el-table-column prop="threshold" label="阈值" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'resolved' ? 'success' : 'danger'">
              {{ scope.row.status === 'resolved' ? '已解决' : '未解决' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              :disabled="scope.row.status === 'resolved'"
              @click="resolveAlert(scope.row)"
            >
              解决
            </el-button>
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
        :total="total"
      />
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'Alerts',
    setup() {
      const store = useStore()
      const devices = ref([])
      const alerts = ref([])
      const currentPage = ref(1)
      const pageSize = ref(10)
      const total = ref(0)
  
      const queryForm = reactive({
        deviceId: '',
        dateRange: []
      })
  
      const fetchDevices = async () => {
        try {
          const response = await store.dispatch('devices/fetchDevices')
          devices.value = response
        } catch (error) {
          ElMessage.error('获取设备列表失败')
        }
      }
  
      const fetchAlerts = async () => {
        try {
          const response = await store.dispatch('alerts/fetchAlerts', {
            deviceId: queryForm.deviceId,
            startDate: queryForm.dateRange[0],
            endDate: queryForm.dateRange[1],
            page: currentPage.value,
            size: pageSize.value
          })
          alerts.value = response.data
          total.value = response.total
        } catch (error) {
          ElMessage.error('获取警报列表失败')
        }
      }
  
      const resolveAlert = async (alert) => {
        try {
          await store.dispatch('alerts/resolveAlert', alert.id)
          ElMessage.success('警报已解决')
          fetchAlerts()
        } catch (error) {
          ElMessage.error('解决警报失败')
        }
      }
  
      const handleSizeChange = (val) => {
        pageSize.value = val
        fetchAlerts()
      }
  
      const handleCurrentChange = (val) => {
        currentPage.value = val
        fetchAlerts()
      }
  
      onMounted(() => {
        fetchDevices()
        fetchAlerts()
      })
  
      return {
        devices,
        alerts,
        queryForm,
        currentPage,
        pageSize,
        total,
        fetchAlerts,
        resolveAlert,
        handleSizeChange,
        handleCurrentChange
      }
    }
  }
  </script>
  
  <style scoped>
  .alerts {
    padding: 20px;
  }
  </style>