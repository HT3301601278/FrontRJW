<template>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :router="true"
    >
      <el-menu-item index="1" route="/">
        <el-icon><Monitor /></el-icon>
        <span>实时监控</span>
      </el-menu-item>
      <el-menu-item index="2" route="/devices">
        <el-icon><Setting /></el-icon>
        <span>设备管理</span>
      </el-menu-item>
      <el-menu-item index="3" route="/analysis">
        <el-icon><DataLine /></el-icon>
        <span>数据分析</span>
      </el-menu-item>
      <el-menu-item index="4" route="/alerts">
        <el-icon><Warning /></el-icon>
        <span>警报管理</span>
      </el-menu-item>
      <el-menu-item index="5" route="/users">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
    </el-menu>
  </template>
  
  <script>
  export default {
    name: 'SideMenu'
  }
  </script>
  
  <style scoped>
  .el-menu-vertical-demo {
    height: 100%;
  }
  </style>