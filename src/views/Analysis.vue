<template>
    <div class="analysis">
      <h2>数据分析</h2>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="设备">
          <el-select v-model="queryForm.deviceId" placeholder="选择设备">
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
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
  
      <div id="chart" style="width: 100%; height: 400px;"></div>
  
      <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="recordTime" label="记录时间" />
        <el-table-column prop="value" label="压力值" />
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
  import * as echarts from 'echarts'
  
  export default {
    name: 'Analysis',
    setup() {
      const store = useStore()
      const devices = ref([])
      const tableData = ref([])
      const currentPage = ref(1)
      const pageSize = ref(10)
      const total = ref(0)
      let chart = null
  
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
  
      const fetchData = async () => {
        if (!queryForm.deviceId || !queryForm.dateRange.length) {
          ElMessage.warning('请选择设备和时间范围')
          return
        }
  
        try {
          const response = await store.dispatch('devices/fetchDeviceData', {
            deviceId: queryForm.deviceId,
            startTime: queryForm.dateRange[0],
            endTime: queryForm.dateRange[1],
            page: currentPage.value,
            size: pageSize.value
          })
          tableData.value = response.data
          total.value = response.total
          updateChart(response.data)
        } catch (error) {
          ElMessage.error('获取数据失败')
        }
      }
  
      const updateChart = (data) => {
        if (!chart) {
          chart = echarts.init(document.getElementById('chart'))
        }
  
        const option = {
          title: {
            text: '压力数据分析'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.recordTime)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: data.map(item => item.value),
            type: 'line'
          }]
        }
  
        chart.setOption(option)
      }
  
      const handleSizeChange = (val) => {
        pageSize.value = val
        fetchData()
      }
  
      const handleCurrentChange = (val) => {
        currentPage.value = val
        fetchData()
      }
  
      onMounted(() => {
        fetchDevices()
      })
  
      return {
        devices,
        queryForm,
        tableData,
        currentPage,
        pageSize,
        total,
        fetchData,
        handleSizeChange,
        handleCurrentChange
      }
    }
  }
  </script>
  
  <style scoped>
  .analysis {
    padding: 20px;
  }
  </style>