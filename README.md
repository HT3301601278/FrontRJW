# 反应器压力在线监测系统

## 项目简介

这是一个基于Vue 3和Element Plus的反应器压力在线监测系统前端项目。该系统旨在实时监控和管理多个反应器的压力数据,提供数据分析、警报管理等功能,帮助用户更好地管理和优化反应器的运行。

## 技术栈

- Vue 3
- Vue Router
- Vuex
- Element Plus
- ECharts
- Axios

## 项目结构

```
src/
|-- assets/           # 静态资源文件
|-- components/       # 公共组件
|-- layouts/          # 布局组件
|-- router/           # 路由配置
|-- store/            # Vuex状态管理
|-- views/            # 页面视图组件
|-- App.vue           # 根组件
|-- main.js           # 入口文件
```

## 主要功能模块

1. 登录模块
2. 仪表盘
3. 设备管理
4. 数据分析
5. 警报中心
6. 个人中心

## 详细模块说明

### 1. 登录模块 (LoginView.vue)

登录模块负责用户的身份验证,包括以下功能:

- 用户登录
- 新用户注册

### 2. 仪表盘 (DashboardView.vue)

仪表盘提供系统的整体概览,包括以下内容:

- 关键指标卡片(总反应器数量、在线反应器数量、平均压力、异常反应器数量)
- 实时压力曲线图
- 反应器状态分布饼图
- 最近警报列表

### 3. 设备管理 (DeviceManagementView.vue)

设备管理模块用于管理所有反应器设备,主要功能包括:

- 设备列表展示
- 添加新设备
- 删除设备
- 设备详情查看
- 设备开关控制
- 设备压力阈值设置

### 4. 数据分析 (DataAnalysisView.vue)

数据分析模块提供反应器压力数据的可视化分析,包括:

- 压力趋势图
- 压力分布饼图
- 设备压力详情对比图

### 5. 警报中心 (AlertCenterView.vue)

警报中心负责管理和展示系统的警报信息,功能包括:

- 警报列表展示
- 警报筛选(按设备、时间范围)
- 警报状态标记

### 6. 个人中心 (ProfileView.vue)

个人中心允许用户管理个人信息,主要功能是:

- 查看用户信息
- 修改密码

## 公共组件

### 1. 顶部导航栏 (TopNavBar.vue)

顶部导航栏提供主要功能模块的快速访问和用户操作。

### 2. 主布局 (MainLayout.vue)

主布局组件定义了应用的整体结构。

## API文档

1. 用户登录
```
POST http://47.116.66.208:8080/api/users/login

请求体:
{
  username: string,
  password: string
}

响应:
{
  id: number,
  username: string,
  // 其他用户信息
}
```

2. 用户注册
```
POST http://47.116.66.208:8080/api/users/register

请求体:
{
  username: string,
  password: string
}

响应:
{
  id: number,
  username: string,
  // 其他用户信息
}
```

3. 修改用户密码
```
PUT http://47.116.66.208:8080/api/users/{userId}/password

请求参数:
oldPassword: string
newPassword: string

响应:
{
  id: number,
  // 其他用户信息
}
```

4. 获取设备列表
```
GET http://47.116.66.208:8080/api/devices

请求参数:
page: number (从0开始)
size: number

响应:
{
  content: [
    {
      id: number,
      name: string,
      macAddress: string,
      communicationChannel: string,
      threshold: number | null,
      isOn: boolean
    }
  ],
  totalElements: number,
  // 其他分页信息
}
```

5. 添加设备
```
POST http://47.116.66.208:8080/api/devices

请求体:
{
  name: string,
  macAddress: string,
  communicationChannel: string,
  threshold: number | null,
  isOn: boolean
}

响应:
{
  id: number,
  name: string,
  macAddress: string,
  communicationChannel: string,
  threshold: number | null,
  isOn: boolean
}
```

6. 删除设备
```
DELETE http://47.116.66.208:8080/api/devices/{deviceId}

响应:
200 OK
```

7. 切换设备状态
```
PUT http://47.116.66.208:8080/api/devices/{deviceId}/toggle

响应:
{
  id: number,
  isOn: boolean,
  // 其他设备信息
}
```

8. 更新设备信息
```
PUT http://47.116.66.208:8080/api/devices/{deviceId}

请求体:
{
  name: string,
  macAddress: string,
  communicationChannel: string,
  threshold: number | null,
  isOn: boolean
}

响应:
{
  id: number,
  name: string,
  macAddress: string,
  communicationChannel: string,
  threshold: number | null,
  isOn: boolean
}
```

9. 获取设备数据
```
GET http://47.116.66.208:8080/api/devices/{deviceId}/data

请求参数:
startTime: string (格式: "YYYY-MM-DD HH:mm:ss")
endTime: string (格式: "YYYY-MM-DD HH:mm:ss")

响应:
{
  content: [
    {
      id: number,
      value: number,
      recordTime: string
    }
  ],
  // 其他分页信息
}
```

## 路由配置

路由配置定义了应用的页面结构和导航逻辑。

## 开始使用

1. 克隆项目到本地
2. 安装依赖: `npm install`
3. 运行开发服务器: `npm run serve`
4. 构建生产版本: `npm run build`