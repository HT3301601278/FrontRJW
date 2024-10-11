<template>
    <el-container class="layout-container">
      <el-aside width="200px">
        <SideMenu />
      </el-aside>
      <el-container>
        <el-header>
          <TopNavBar />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import SideMenu from '@/components/SideMenu.vue'
  import TopNavBar from '@/components/TopNavBar.vue'
  
  export default defineComponent({
    name: 'MainLayout',
    components: {
      SideMenu,
      TopNavBar
    }
  })
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
  }
  
  .el-header {
    background-color: #fff;
    color: #333;
    line-height: 60px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
  
  .el-aside {
    background-color: #001529;
    color: #fff;
  }
  
  .el-main {
    background-color: #f0f2f5;
    color: #333;
  }
  </style>