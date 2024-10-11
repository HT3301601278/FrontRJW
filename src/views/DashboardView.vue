<template>
    <div class="dashboard">
      <h2>仪表盘</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(card, index) in cards" :key="index">
          <el-card class="dashboard-card" :body-style="{ padding: '0px' }">
            <div class="card-content">
              <el-icon :size="40" :color="card.color">
                <component :is="card.icon" />
              </el-icon>
              <div class="card-info">
                <div class="card-title">{{ card.title }}</div>
                <div class="card-value">{{ card.value }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
  
      <el-row :gutter="20" class="chart-row">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>实时压力曲线图</span>
              </div>
            </template>
            <div ref="pressureChart" style="height: 300px;"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>最近警报</span>
              </div>
            </template>
            <el-table :data="recentAlerts" style="width: 100%">
              <el-table-column prop="time" label="时间" width="180"></el-table-column>
              <el-table-column prop="device" label="反应器"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, reactive } from 'vue'
  import { Monitor, Sunny, Warning, DataLine } from '@element-plus/icons-vue'
  import * as echarts from 'echarts'
  
  export default {
    name: 'DashboardView',
    components: { Monitor, Sunny, Warning, DataLine },
    setup() {
      const pressureChart = ref(null)
      const chart = ref(null)
  
      const cards = reactive([
        { title: '总反应器数量', value: 42, icon: 'Monitor', color: '#409EFF' },
        { title: '在线反应器数量', value: 38, icon: 'Sunny', color: '#67C23A' },
        { title: '平均压力', value: '5.6 MPa', icon: 'DataLine', color: '#E6A23C' },
        { title: '异常反应器数量', value: 2, icon: 'Warning', color: '#F56C6C' },
      ])
  
      const recentAlerts = ref([
        { time: '2023-06-01 10:30', device: '反应器A', type: '压力过高' },
        { time: '2023-06-01 09:15', device: '反应器B', type: '离线' },
        { time: '2023-05-31 23:45', device: '反应器C', type: '压力过低' },
      ])
  
      onMounted(() => {
        chart.value = echarts.init(pressureChart.value)
        const option = {
          title: {
            text: '实时压力'
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
            data: [3.2, 2.8, 2.5, 5.0, 8.0, 7.5, 6.0, 4.0],
            type: 'line',
            smooth: true
          }]
        }
        chart.value.setOption(option)
      })
  
      return {
        cards,
        recentAlerts,
        pressureChart
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  
  .dashboard-card {
    margin-bottom: 20px;
  }
  
  .card-content {
    display: flex;
    align-items: center;
    padding: 20px;
  }
  
  .card-info {
    margin-left: 20px;
  }
  
  .card-title {
    font-size: 14px;
    color: #909399;
  }
  
  .card-value {
    font-size: 24px;
    font-weight: bold;
    margin-top: 5px;
  }
  
  .chart-row {
    margin-top: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>