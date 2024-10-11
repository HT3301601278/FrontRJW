<template>
  <div class="alert-center">
    <h2>警报中心</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <el-form-item label="设备">
                  <el-select v-model="filterForm.device" placeholder="选择设备">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="device in devices"
                      :key="device.id"
                      :label="device.name"
                      :value="device.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="filterForm.dateRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleFilter">筛选</el-button>
                  <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <el-table :data="alerts" style="width: 100%">
            <el-table-column prop="timestamp" label="时间" width="180"></el-table-column>
            <el-table-column prop="device.name" label="设备"></el-table-column>
            <el-table-column prop="message" label="警报信息"></el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalAlerts"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'AlertCenterView',
  setup() {
    const filterForm = reactive({
      device: '',
      dateRange: []
    })

    const devices = ref([])
    const alerts = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalAlerts = ref(0)

    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://47.116.66.208:8080/api/devices')
        devices.value = response.data.content
      } catch (error) {
        console.error('获取设备列表失败:', error)
        ElMessage.error('获取设备列表失败，请稍后重试')
      }
    }

    const fetchAlerts = async () => {
      let url = `http://47.116.66.208:8080/api/alerts?page=${currentPage.value - 1}&size=${pageSize.value}`

      if (filterForm.device && filterForm.dateRange && filterForm.dateRange.length === 2) {
        url = `http://47.116.66.208:8080/api/alerts/device/${filterForm.device}/timerange?startDate=${filterForm.dateRange[0]}&endDate=${filterForm.dateRange[1]}&page=${currentPage.value - 1}&size=${pageSize.value}`
      } else if (filterForm.device) {
        url = `http://47.116.66.208:8080/api/alerts/device/${filterForm.device}?page=${currentPage.value - 1}&size=${pageSize.value}`
      } else if (filterForm.dateRange && filterForm.dateRange.length === 2) {
        url = `http://47.116.66.208:8080/api/alerts/timerange?startDate=${filterForm.dateRange[0]}&endDate=${filterForm.dateRange[1]}&page=${currentPage.value - 1}&size=${pageSize.value}`
      }

      try {
        const response = await axios.get(url)
        alerts.value = response.data.content
        totalAlerts.value = response.data.totalElements
      } catch (error) {
        console.error('获取警报数据失败:', error)
        ElMessage.error('获取警报数据失败，请稍后重试')
      }
    }

    const handleFilter = () => {
      currentPage.value = 1
      fetchAlerts()
    }

    const resetFilter = () => {
      filterForm.device = ''
      filterForm.dateRange = []
      currentPage.value = 1
      fetchAlerts()
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
      filterForm,
      devices,
      alerts,
      currentPage,
      pageSize,
      totalAlerts,
      handleFilter,
      resetFilter,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.alert-center {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>