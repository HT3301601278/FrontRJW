<template>
  <div class="data-analysis">
    <h2>数据分析</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[
                  new Date(2000, 1, 1, 0, 0, 0),
                  new Date(2000, 1, 1, 23, 59, 59)
                ]"
                @change="handleDateRangeChange"
              ></el-date-picker>
              <el-select v-model="selectedDevice" placeholder="选择设备" @change="handleDeviceChange" :loading="loading">
                <el-option
                  v-for="device in devices"
                  :key="device.id"
                  :label="device.name"
                  :value="device.id"
                ></el-option>
              </el-select>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="16">
              <div ref="lightIntensityTrendChart" style="height: 400px;"></div>
            </el-col>
            <el-col :span="8">
              <div ref="lightIntensityDistributionChart" style="height: 400px;"></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <div ref="deviceComparisonChart" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'DataAnalysisView',
  setup() {
    const dateRange = ref([])
    const selectedDevice = ref('')
    const devices = ref([])
    const loading = ref(false)
    const lightIntensityTrendChart = ref(null)
    const lightIntensityDistributionChart = ref(null)
    const deviceComparisonChart = ref(null)

    const fetchDevices = async () => {
      loading.value = true
      try {
        const response = await axios.get('http://47.116.66.208:8080/api/devices')
        devices.value = response.data.content
        console.log('获取到的设备列表:', devices.value)
      } catch (error) {
        console.error('获取设备列表失败:', error)
        ElMessage.error('获取设备列表失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    const handleDateRangeChange = () => {
      if (selectedDevice.value) {
        fetchDeviceData()
      }
    }

    const handleDeviceChange = () => {
      if (dateRange.value && dateRange.value.length === 2) {
        fetchDeviceData()
      }
    }

    const fetchDeviceData = async () => {
      if (!selectedDevice.value || !dateRange.value || dateRange.value.length !== 2) {
        return
      }

      const startTime = dateRange.value[0].toISOString().slice(0, 19).replace('T', ' ')
      const endTime = dateRange.value[1].toISOString().slice(0, 19).replace('T', ' ')

      try {
        const response = await axios.get(`http://47.116.66.208:8080/api/devices/${selectedDevice.value}/data`, {
          params: {
            startTime,
            endTime
          }
        })

        const data = response.data.content
        const lightIntensityValues = data.map(item => parseFloat(item.value))
        const recordTimes = data.map(item => item.recordTime)
        updateCharts(recordTimes, lightIntensityValues)
      } catch (error) {
        console.error('获取设备数据失败:', error)
        ElMessage.error('获取设备数据失败，请稍后重试')
      }
    }

    const updateCharts = (times, values) => {
      const avgLightIntensity = calculateAverage(values)
      const maxLightIntensity = Math.max(...values)
      const minLightIntensity = Math.min(...values)

      updateLightIntensityTrendChart(times, values)
      updateLightIntensityDistributionChart(values)
      updateDeviceComparisonChart(avgLightIntensity, maxLightIntensity, minLightIntensity)
    }

    const calculateAverage = (arr) => {
      return arr.reduce((a, b) => a + b, 0) / arr.length
    }

    const updateLightIntensityTrendChart = (times, values) => {
      const chart = echarts.init(lightIntensityTrendChart.value)

      // 将时间和值组合成对象数组，并按时间排序
      let sortedData = times.map((time, index) => ({ time: new Date(time), value: values[index] }))
        .sort((a, b) => a.time - b.time)

      // 按天分组并随机选择一个数据点
      const groupedData = {}
      sortedData.forEach(item => {
        const day = item.time.toISOString().split('T')[0]
        if (!groupedData[day]) {
          groupedData[day] = []
        }
        groupedData[day].push(item)
      })

      const sampledData = Object.values(groupedData).map(group => {
        return group[Math.floor(Math.random() * group.length)]
      })

      // 确保数据按时间排序
      sampledData.sort((a, b) => a.time - b.time)

      const option = {
        title: {
          text: '压力趋势图'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'time',
          min: dateRange.value[0],
          max: dateRange.value[1],
          axisLabel: {
            formatter: (value) => {
              return new Date(value).toLocaleDateString('zh-CN', {
                month: 'numeric',
                day: 'numeric'
              })
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '压力 (MPa)'
        },
        series: [{
          data: sampledData.map(item => [item.time, item.value]),
          type: 'line',
          smooth: true
        }]
      }
      chart.setOption(option)
    }

    const updateLightIntensityDistributionChart = (values) => {
      const chart = echarts.init(lightIntensityDistributionChart.value)
      const categories = {
        '强压': 0,
        '中等压': 0,
        '弱压': 0,
        '微压': 0
      }

      values.forEach(value => {
        if (value > 1000) {
          categories['强压']++
        } else if (value > 500) {
          categories['中等压']++
        } else if (value > 100) {
          categories['弱压']++
        } else {
          categories['微压']++
        }
      })

      const option = {
        title: {
          text: '压力分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '压力分布',
            type: 'pie',
            radius: '50%',
            data: Object.entries(categories).map(([name, value]) => ({ name, value })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chart.setOption(option)
    }

    const updateDeviceComparisonChart = (avg, max, min) => {
      const chart = echarts.init(deviceComparisonChart.value)
      const option = {
        title: {
          text: '设备压力详情'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['选中设备']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '压力 (MPa)'
          }
        ],
        series: [
          {
            name: '平均压力',
            type: 'bar',
            data: [avg]
          },
          {
            name: '最大压力',
            type: 'bar',
            data: [max]
          },
          {
            name: '最小压力',
            type: 'bar',
            data: [min]
          }
        ]
      }
      chart.setOption(option)
    }

    onMounted(() => {
      fetchDevices()
    })

    watch([dateRange, selectedDevice], () => {
      if (dateRange.value && dateRange.value.length === 2 && selectedDevice.value) {
        fetchDeviceData()
      }
    })

    return {
      dateRange,
      selectedDevice,
      devices,
      loading,
      lightIntensityTrendChart,
      lightIntensityDistributionChart,
      deviceComparisonChart,
      handleDateRangeChange,
      handleDeviceChange
    }
  }
}
</script>

<style scoped>
.data-analysis {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-date-picker {
  margin-right: 20px;
}
</style>
