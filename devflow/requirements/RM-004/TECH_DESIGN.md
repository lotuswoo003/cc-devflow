---
requirement_id: RM-004
title: Vue管理后台框架 - Technical Design
version: 1.0.0
status: Draft
created: 2025-11-21T17:00:00+08:00
updated: 2025-11-21T17:10:00+08:00
author: tech-architect agent
template_version: TECH_DESIGN_TEMPLATE v2.0.0
---

# Technical Design: RM-004 - Vue管理后台框架

**Project**: 陪玩服务平台 - B端管理后台
**Type**: Frontend Framework Foundation
**Architecture**: 前后端分离 (Frontend-Backend Separation)

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Data Models](#3-data-models)
4. [API Design](#4-api-design)
5. [Security Design](#5-security-design)
6. [Performance Optimization](#6-performance-optimization)
7. [Testing Strategy](#7-testing-strategy)
8. [Development Workflow](#8-development-workflow)
9. [Build & Deployment](#9-build--deployment)
10. [Dependencies Management](#10-dependencies-management)
11. [Risk Assessment](#11-risk-assessment)
12. [Constitution Compliance](#12-constitution-compliance)

---

## 1. System Architecture

### 1.1 Architecture Overview

**Architecture Style**: 三端分离 (Three-Tier Separation)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Applications                         │
├────────────────┬────────────────────────┬───────────────────────┤
│                │                        │                        │
│  微信小程序     │    Vue管理后台 ←────   │   Mobile App (未来)   │
│  (RM-001)      │    (RM-004)            │                        │
│  C端用户        │    B端运营人员          │                        │
│                │                        │                        │
└────────┬───────┴────────────┬───────────┴───────────────────────┘
         │                    │
         │    HTTPS / REST    │
         └────────┬───────────┘
                  │
         ┌────────▼─────────────────────────────────────────┐
         │          SpringBoot Backend API                  │
         │          (RM-009, RM-010)                        │
         │                                                  │
         │  ┌──────────────┐  ┌──────────────┐            │
         │  │ Auth Service  │  │ Business     │            │
         │  │              │  │ Services     │            │
         │  └──────────────┘  └──────────────┘            │
         │          │                  │                   │
         └──────────┼──────────────────┼───────────────────┘
                    │                  │
         ┌──────────▼──────────────────▼───────────────────┐
         │              MySQL Database 8.0                  │
         │              (RM-010)                            │
         └──────────────────────────────────────────────────┘
```

**Current Scope (RM-004)**: Vue管理后台框架
- **Development Strategy**: 前端先行 + Mock数据 (Frontend-first with Mock data)
- **Future Integration**: RM-011 will integrate with SpringBoot backend APIs

### 1.2 Frontend Architecture (Vue Admin Dashboard)

```
┌─────────────────────────────────────────────────────────────────┐
│                   Vue 3 Admin Dashboard                          │
│                   (Single Page Application)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │  Presentation  │  │     State      │  │   API Service   │  │
│  │     Layer      │  │  Management    │  │      Layer      │  │
│  │                │  │                │  │                 │  │
│  │  - Login View  │  │  - User Store  │  │  - auth.ts      │  │
│  │  - Dashboard   │  │  - App Store   │  │  - user.ts      │  │
│  │  - Layout      │  │  - Permission  │  │  - menu.ts      │  │
│  │  - Components  │  │    Store       │  │  - request.ts   │  │
│  │                │  │                │  │    (Axios)      │  │
│  │  (Vue 3 SFC)   │  │  (Pinia)       │  │                 │  │
│  └────────┬───────┘  └───────┬────────┘  └────────┬────────┘  │
│           │                  │                     │            │
│           └──────────────────┼─────────────────────┘            │
│                              │                                  │
│  ┌───────────────────────────▼────────────────────────────┐    │
│  │              Router Guard & Middleware                  │    │
│  │          (Authentication & Authorization)               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │    Mock Data (开发阶段)      │
                │    vite-plugin-mock         │
                │    OR                       │
                │    Backend API (联调后)      │
                │    SpringBoot REST API      │
                └─────────────────────────────┘
```

### 1.3 Module Breakdown

| Module | Responsibility | Dependencies | Status |
|--------|---------------|--------------|--------|
| **项目框架模块** | Vite项目初始化、TypeScript配置、ESLint/Prettier规范 | Vite, Vue 3, TypeScript | Story 1 |
| **UI组件库模块** | Element Plus集成、按需导入、全局样式 | Element Plus, unplugin-vue-components | Story 2 |
| **布局系统模块** | 侧边栏、顶部导航、主内容区、面包屑 | Vue Router, Pinia (appStore) | Story 3 |
| **路由权限模块** | Vue Router配置、路由守卫、动态路由、权限控制 | Vue Router, Pinia (permissionStore) | Story 4 |
| **HTTP请求模块** | Axios封装、拦截器、错误处理、Token自动携带 | Axios, Pinia (userStore) | Story 5 |
| **Mock数据模块** | Mock.js集成、API拦截、数据生成 | vite-plugin-mock, Mock.js | Story 6 |
| **状态管理模块** | Pinia Store配置、用户状态、应用状态、权限状态 | Pinia | Story 7 |
| **认证登录模块** | 登录页、JWT Token管理、用户信息获取 | Axios, Pinia (userStore), Element Plus | Story 8 |
| **Dashboard模块** | 首页演示、统计卡片、数据表格 | Element Plus, ECharts (可选) | Story 9 |

**Module Dependencies Graph**:

```
项目框架模块 (Story 1)
    ↓
UI组件库模块 (Story 2)
    ↓
状态管理模块 (Story 7) ←─┐
    ↓                     │
HTTP请求模块 (Story 5) ───┤
    ↓                     │
Mock数据模块 (Story 6)    │
    ↓                     │
认证登录模块 (Story 8) ───┘
    ↓
路由权限模块 (Story 4)
    ↓
布局系统模块 (Story 3)
    ↓
Dashboard模块 (Story 9)
```

### 1.4 Data Flow Patterns

**Authentication Flow** (认证流程):

```
User Input (username/password)
    ↓
Login Form Validation (Frontend)
    ↓
Password Encryption (SHA256)
    ↓
POST /api/v1/auth/login (Axios)
    ↓
[Development] Mock Response (vite-plugin-mock)
[Production] Backend API Response
    ↓
Response: { token, user, permissions, expiresIn }
    ↓
Store in Pinia (userStore.token, userStore.userInfo)
    ↓
Store in LocalStorage (persistent)
    ↓
Axios Interceptor auto-attaches Bearer token to all requests
    ↓
Success: Redirect to Dashboard
```

**Permission Flow** (权限控制流程):

```
User Login
    ↓
Get User Info + Roles + Permissions
    ↓
Store in Pinia (userStore.roles, userStore.permissions)
    ↓
Router.beforeEach() Navigation Guard
    ↓
Check: Does user have access to target route?
    ├─ YES: Check route.meta.roles
    │   ├─ Roles match: Allow navigation
    │   └─ Roles mismatch: Redirect to 403
    └─ NO: Redirect to login page
    ↓
Generate Dynamic Routes based on permissions
    ↓
Render Menu Items (filter by roles)
    ↓
Render Page with v-permission directive
    ├─ Buttons: Hide if no permission
    └─ Sections: Show based on permission
```

**Data Fetching Flow** (数据请求流程):

```
Component Mounted / User Action
    ↓
Call API Service Function (e.g., userApi.getList())
    ↓
Axios Request Interceptor
    ├─ Add Authorization Header (Bearer token)
    ├─ Add Timestamp (prevent cache)
    └─ Log Request (dev mode)
    ↓
[Development] vite-plugin-mock intercepts request
[Production] Real Backend API
    ↓
Axios Response Interceptor
    ├─ Check response.data.code
    │   ├─ 200: Extract data, return to component
    │   ├─ 401: Logout, redirect to login
    │   ├─ 403: Show "Permission Denied" message
    │   └─ 500: Show "Server Error" message
    └─ Network Error: Show "Network Error" message
    ↓
Component receives data
    ↓
Update reactive state (ref / reactive)
    ↓
Vue reactivity triggers re-render
```

---

## 2. Technology Stack

### 2.1 Core Technologies (BASELINE from CLAUDE.md)

| Layer | Technology | Version | Rationale (Research Decision) |
|-------|-----------|---------|-------------------------------|
| **Framework** | Vue 3 | 3.5+ | 官方推荐，Composition API，性能优秀，生态成熟 (R010参考项目) |
| **Language** | TypeScript | 5.8+ | 类型安全，IDE支持好，减少运行时错误 |
| **Build Tool** | Vite | 7+ | 开发速度快，HMR体验好，官方推荐 (R003) |
| **UI Library** | Element Plus | 2.9+ | Vue 3原生支持，组件丰富(60+)，中文文档完善 (R001) |
| **State Management** | Pinia | 2.3+ | Vue 3官方推荐，API简单，TypeScript支持好 (R002) |
| **Router** | Vue Router | 4.5+ | 官方唯一选择，支持动态路由和路由守卫 (R005) |
| **HTTP Client** | Axios | 1.7+ | 最流行，支持拦截器，TypeScript支持好 (R006) |
| **Mock Solution** | Mock.js + vite-plugin-mock | 1.1+ / 3.0+ | 快速验证，不依赖后端，热更新支持 (R007) |

### 2.2 Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **npm / pnpm** | 9+ / 8+ | Package manager (pnpm推荐，速度更快) |
| **ESLint** | 9+ | Code quality enforcement (R009) |
| **Prettier** | 3+ | Code formatting (R009) |
| **unplugin-auto-import** | 0.18+ | Auto import Vue APIs, reduce boilerplate |
| **unplugin-vue-components** | 0.27+ | Element Plus按需导入 (R001) |
| **@element-plus/icons-vue** | 2.3+ | Element Plus icon library |

### 2.3 Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2.0+ | Unit testing framework (Vite-native, fast) |
| **@vue/test-utils** | 2.4+ | Vue component testing utilities |
| **Happy DOM** | 14+ | Lightweight DOM implementation for Vitest |
| **@vitest/coverage-v8** | 2.0+ | Code coverage reporter |

### 2.4 Optional Enhancements (Not in RM-004 Scope)

| Tool | Purpose | Future Requirement |
|------|---------|-------------------|
| **ECharts / Chart.js** | Data visualization | RM-005~008 (具体业务页面) |
| **VueUse** | Vue composition utilities | 可选，按需引入 |
| **Day.js** | Date manipulation | RM-007 (用户列表页面) |
| **Lodash-es** | Utility functions | 按需引入，避免全量导入 |

### 2.5 Technology Decision Matrix

**Anti-Tech-Creep Enforcement**: 所有技术选型必须基于research.md中的决策(R001-R010)，禁止随意引入新技术。

| Baseline | Alternative (Rejected) | Reason for Rejection |
|----------|------------------------|----------------------|
| Vue 3 | React, Svelte | 团队技术栈统一，Vue 3生态成熟 |
| Vite | Webpack 5 | Vite开发速度快，配置简单 (R003) |
| Element Plus | Ant Design Vue, Vuetify | 中文文档完善，符合国内审美 (R001) |
| Pinia | Vuex 4 | Pinia API简单，官方推荐 (R002) |
| Axios | Fetch API, ky | Axios功能完善，生态成熟 (R006) |
| Mock.js | MSW, JSON Server | vite-plugin-mock集成良好 (R007) |
| ESLint + Prettier | StandardJS | 灵活性高，社区标准 (R009) |

---

## 3. Data Models

### 3.1 Domain Entities (TypeScript Interfaces)

#### User Entity (用户实体)

```typescript
// src/types/user.ts

export interface User {
  id: string                          // 用户唯一标识 (UUID)
  username: string                    // 用户名 (4-16字符)
  email: string                       // 邮箱地址
  phone?: string                      // 手机号 (可选)
  avatar?: string                     // 头像URL (可选)
  roles: Role[]                       // 用户角色列表
  status: UserStatus                  // 用户状态
  createdAt: string                   // 创建时间 (ISO 8601)
  updatedAt: string                   // 更新时间 (ISO 8601)
  lastLoginAt?: string                // 最后登录时间 (可选)
}

export enum UserStatus {
  Active = 'active',                  // 激活状态
  Inactive = 'inactive',              // 未激活
  Locked = 'locked',                  // 锁定状态
  Deleted = 'deleted'                 // 已删除 (软删除)
}

export interface Role {
  id: string                          // 角色ID
  name: string                        // 角色名称 (admin, operator, viewer)
  code: string                        // 角色代码 (ROLE_ADMIN, ROLE_OPERATOR)
  permissions: Permission[]           // 权限列表
  description?: string                // 角色描述
}

export interface Permission {
  id: string                          // 权限ID
  resource: string                    // 资源标识 (service, user, menu)
  action: PermissionAction            // 操作类型
  code: string                        // 权限代码 (service:read, user:write)
}

export enum PermissionAction {
  Read = 'read',                      // 读取
  Write = 'write',                    // 写入 (创建/更新)
  Delete = 'delete',                  // 删除
  Execute = 'execute'                 // 执行 (特殊操作)
}
```

#### Menu Entity (菜单实体)

```typescript
// src/types/menu.ts

export interface MenuItem {
  id: string                          // 菜单ID
  parentId?: string                   // 父菜单ID (可选，顶级菜单为空)
  path: string                        // 路由路径 (e.g., /dashboard)
  name: string                        // 路由名称 (e.g., Dashboard)
  component: string                   // 组件路径 (e.g., views/dashboard/index.vue)
  redirect?: string                   // 重定向路径 (可选)
  meta: MenuMeta                      // 元信息
  children?: MenuItem[]               // 子菜单列表
  sort: number                        // 排序序号
}

export interface MenuMeta {
  title: string                       // 菜单标题 (显示在侧边栏)
  icon?: string                       // 图标名称 (Element Plus icon)
  hidden: boolean                     // 是否隐藏 (不在菜单显示但路由存在)
  alwaysShow: boolean                 // 是否总是显示根菜单 (单个子菜单时)
  noCache: boolean                    // 是否缓存 (keep-alive)
  breadcrumb: boolean                 // 是否显示在面包屑
  activeMenu?: string                 // 激活的菜单路径 (用于详情页)
  roles?: string[]                    // 允许访问的角色 (为空则所有角色可访问)
  permissions?: string[]              // 允许访问的权限 (为空则所有权限可访问)
}
```

### 3.2 API Request/Response Types

#### Authentication Types (认证相关)

```typescript
// src/types/api/auth.ts

export interface LoginRequest {
  username: string                    // 用户名或邮箱
  password: string                    // 密码 (前端已加密 SHA256)
  captcha?: string                    // 验证码 (可选，未来扩展)
  remember?: boolean                  // 记住我 (可选，影响Token过期时间)
}

export interface LoginResponse {
  token: string                       // JWT Access Token
  refreshToken?: string               // Refresh Token (可选，用于静默刷新)
  user: User                          // 用户基本信息
  permissions: string[]               // 权限列表 (扁平化，如: ['user:read', 'service:write'])
  expiresIn: number                   // Token过期时间 (秒，如: 7200 = 2小时)
}

export interface RefreshTokenRequest {
  refreshToken: string                // Refresh Token
}

export interface RefreshTokenResponse {
  token: string                       // 新的 Access Token
  expiresIn: number                   // 过期时间
}
```

#### Pagination Types (分页相关)

```typescript
// src/types/api/common.ts

export interface PageRequest {
  page: number                        // 页码 (从1开始)
  size: number                        // 每页数量 (默认20)
  sort?: string                       // 排序字段 (如: createdAt)
  order?: 'asc' | 'desc'              // 排序方向 (升序/降序)
  [key: string]: any                  // 其他查询参数 (如: status, keyword)
}

export interface PageResponse<T> {
  list: T[]                           // 数据列表
  total: number                       // 总记录数
  page: number                        // 当前页码
  size: number                        // 每页数量
  pages: number                       // 总页数
}

export interface ApiResponse<T = any> {
  code: number                        // 业务状态码 (200=成功, 401=未授权, 403=禁止, 500=错误)
  data: T                             // 业务数据
  message: string                     // 提示信息
  timestamp: number                   // 响应时间戳 (毫秒)
}
```

### 3.3 Pinia Store State Models

#### User Store State (用户状态)

```typescript
// src/stores/user.ts

export interface UserState {
  token: string | null                // JWT Token
  refreshToken: string | null         // Refresh Token (可选)
  userInfo: User | null               // 当前用户信息
  roles: string[]                     // 角色代码列表 (如: ['ROLE_ADMIN'])
  permissions: string[]               // 权限代码列表 (如: ['user:read', 'service:write'])
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: null,
    refreshToken: null,
    userInfo: null,
    roles: [],
    permissions: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasPermission: (state) => (permission: string) => state.permissions.includes(permission)
  },

  actions: {
    // Actions defined in Section 4.3
  }
})
```

#### App Store State (应用状态)

```typescript
// src/stores/app.ts

export interface SidebarState {
  opened: boolean                     // 侧边栏是否展开
  withoutAnimation: boolean           // 是否禁用动画
}

export interface AppState {
  sidebar: SidebarState               // 侧边栏状态
  device: DeviceType                  // 设备类型
  language: string                    // 语言 (默认 zh-CN)
  size: ComponentSize                 // Element Plus 组件尺寸
}

export enum DeviceType {
  Desktop = 'desktop',                // 桌面端 (≥1024px)
  Mobile = 'mobile'                   // 移动端 (<1024px)
}

export type ComponentSize = 'default' | 'large' | 'small'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: DeviceType.Desktop,
    language: 'zh-CN',
    size: 'default'
  })
})
```

#### Permission Store State (权限状态)

```typescript
// src/stores/permission.ts

export interface PermissionState {
  routes: RouteRecordRaw[]            // 所有路由 (静态 + 动态)
  dynamicRoutes: RouteRecordRaw[]     // 动态路由 (根据权限过滤)
  isRoutesGenerated: boolean          // 路由是否已生成
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    dynamicRoutes: [],
    isRoutesGenerated: false
  })
})
```

---

## 4. API Design

### 4.1 RESTful API Conventions

**Base URL**: `/api/v1`

**Standard Response Format**:

```typescript
{
  "code": 200,              // 业务状态码
  "data": { ... },          // 业务数据
  "message": "操作成功",     // 提示信息
  "timestamp": 1700000000000 // 时间戳
}
```

**HTTP Status Codes** (Backend responsibility):
- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `204 No Content`: 删除成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权 (Token无效或过期)
- `403 Forbidden`: 禁止访问 (权限不足)
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器错误

### 4.2 API Endpoints (Contract with Backend RM-010)

#### Authentication APIs

```http
# 登录
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "username": "admin",
  "password": "e10adc3949ba59abbe56e057f20f883e"  // SHA256加密后
}

Response (200 OK):
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "1", "username": "admin", ... },
    "permissions": ["*:*:*"],
    "expiresIn": 7200
  },
  "message": "登录成功",
  "timestamp": 1700000000000
}

Response (401 Unauthorized):
{
  "code": 401,
  "data": null,
  "message": "用户名或密码错误",
  "timestamp": 1700000000000
}

# 登出
POST /api/v1/auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "code": 200,
  "data": null,
  "message": "登出成功",
  "timestamp": 1700000000000
}

# 获取用户信息
GET /api/v1/auth/userinfo
Authorization: Bearer {token}

Response (200 OK):
{
  "code": 200,
  "data": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com",
    "roles": [{ "id": "1", "name": "admin", "code": "ROLE_ADMIN" }],
    "permissions": ["*:*:*"]
  },
  "message": "获取成功",
  "timestamp": 1700000000000
}
```

#### Menu APIs

```http
# 获取菜单树 (根据当前用户权限过滤)
GET /api/v1/menus
Authorization: Bearer {token}

Response (200 OK):
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "path": "/dashboard",
      "name": "Dashboard",
      "component": "views/dashboard/index.vue",
      "meta": {
        "title": "Dashboard",
        "icon": "dashboard",
        "hidden": false,
        "roles": ["ROLE_ADMIN", "ROLE_OPERATOR"]
      },
      "children": []
    },
    ...
  ],
  "message": "获取成功",
  "timestamp": 1700000000000
}
```

#### User Management APIs (Future - RM-007)

```http
# 用户列表 (分页)
GET /api/v1/users?page=1&size=20&keyword=admin
Authorization: Bearer {token}

# 用户详情
GET /api/v1/users/:id
Authorization: Bearer {token}

# 创建用户
POST /api/v1/users
Authorization: Bearer {token}

# 更新用户
PUT /api/v1/users/:id
Authorization: Bearer {token}

# 删除用户
DELETE /api/v1/users/:id
Authorization: Bearer {token}
```

### 4.3 Axios HTTP Client封装

#### Request Instance Configuration

```typescript
// src/utils/request.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const timeout = 10000  // 10秒超时

const service: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// Request Interceptor (请求拦截器)
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 1. 添加 Token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers!['Authorization'] = `Bearer ${userStore.token}`
    }

    // 2. GET请求添加时间戳 (防止缓存)
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }

    // 3. 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params)
    }

    return config
  },
  (error) => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

// Response Interceptor (响应拦截器)
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data

    // 1. 业务成功 (code=200)
    if (code === 200) {
      return data  // 直接返回业务数据
    }

    // 2. 业务失败 (code!=200)
    ElMessage.error(message || '操作失败')
    return Promise.reject(new Error(message || 'API Error'))
  },
  (error) => {
    // 3. HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:  // 未授权 - Token过期或无效
          ElMessage.error('登录已过期，请重新登录')
          useUserStore().logout()
          router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
          break

        case 403:  // 禁止访问 - 权限不足
          ElMessage.error('权限不足，无法访问')
          break

        case 404:  // 资源不存在
          ElMessage.error('请求的资源不存在')
          break

        case 500:  // 服务器错误
          ElMessage.error('服务器错误，请稍后重试')
          break

        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      // 4. 请求超时
      ElMessage.error('请求超时，请检查网络')
    } else {
      // 5. 网络错误
      ElMessage.error('网络连接失败，请检查网络')
    }

    return Promise.reject(error)
  }
)

export default service
```

#### API Service Layer

```typescript
// src/api/auth.ts

import request from '@/utils/request'
import type { LoginRequest, LoginResponse, User } from '@/types'

export const authApi = {
  // 登录
  login(data: LoginRequest) {
    return request<LoginResponse>({
      url: '/auth/login',
      method: 'post',
      data
    })
  },

  // 登出
  logout() {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request<User>({
      url: '/auth/userinfo',
      method: 'get'
    })
  }
}
```

### 4.4 Mock Data Strategy

#### vite-plugin-mock Configuration

```typescript
// vite.config.ts

import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'src/mock',           // Mock文件目录
      enable: true,                   // 是否启用Mock (开发环境)
      watchFiles: true,               // 监听文件变化
      logger: true                    // 日志输出
    })
  ]
})
```

#### Mock Data Example

```typescript
// src/mock/auth.ts

import { MockMethod } from 'vite-plugin-mock'
import type { ApiResponse, LoginRequest, LoginResponse, User } from '@/types'

const mockUsers: Record<string, User> = {
  admin: {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    roles: [{ id: '1', name: 'admin', code: 'ROLE_ADMIN', permissions: [] }],
    status: 'active',
    avatar: '',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  operator: {
    id: '2',
    username: 'operator',
    email: 'operator@example.com',
    roles: [{ id: '2', name: 'operator', code: 'ROLE_OPERATOR', permissions: [] }],
    status: 'active',
    avatar: '',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
}

export default [
  // 登录接口
  {
    url: '/api/v1/auth/login',
    method: 'post',
    response: ({ body }: { body: LoginRequest }): ApiResponse<LoginResponse> => {
      const { username, password } = body

      // Mock密码: 123456 (SHA256: e10adc3949ba59abbe56e057f20f883e)
      if (mockUsers[username] && password === 'e10adc3949ba59abbe56e057f20f883e') {
        const user = mockUsers[username]
        return {
          code: 200,
          data: {
            token: `mock-jwt-token-${username}-${Date.now()}`,
            user,
            permissions: username === 'admin' ? ['*:*:*'] : ['service:read', 'user:read'],
            expiresIn: 7200
          },
          message: '登录成功',
          timestamp: Date.now()
        }
      } else {
        return {
          code: 401,
          data: null as any,
          message: '用户名或密码错误',
          timestamp: Date.now()
        }
      }
    }
  },

  // 登出接口
  {
    url: '/api/v1/auth/logout',
    method: 'post',
    response: (): ApiResponse<null> => ({
      code: 200,
      data: null,
      message: '登出成功',
      timestamp: Date.now()
    })
  },

  // 获取用户信息
  {
    url: '/api/v1/auth/userinfo',
    method: 'get',
    response: ({ headers }: { headers: Record<string, string> }): ApiResponse<User> => {
      const token = headers.authorization?.replace('Bearer ', '')

      // 从token中提取用户名 (简化处理)
      if (token?.includes('admin')) {
        return {
          code: 200,
          data: mockUsers.admin,
          message: '获取成功',
          timestamp: Date.now()
        }
      } else if (token?.includes('operator')) {
        return {
          code: 200,
          data: mockUsers.operator,
          message: '获取成功',
          timestamp: Date.now()
        }
      } else {
        return {
          code: 401,
          data: null as any,
          message: 'Token无效',
          timestamp: Date.now()
        }
      }
    }
  }
] as MockMethod[]
```

---

## 5. Security Design

### 5.1 Authentication Strategy (JWT Token)

**Token Storage**:
- **Access Token**: `localStorage.getItem('token')`
- **Refresh Token**: `localStorage.getItem('refreshToken')` (可选)
- **User Info**: Pinia Store (内存，页面刷新后重新从 `/auth/userinfo` 获取)

**Token Lifecycle**:

```
1. User Login → Backend returns JWT Token (有效期2小时)
2. Store Token in:
   - LocalStorage (persistent across page refresh)
   - Pinia userStore (in-memory for fast access)
3. Every API request:
   - Axios Interceptor auto-attaches: Authorization: Bearer {token}
4. Token Expired (401):
   - Clear LocalStorage & Pinia Store
   - Redirect to Login Page with redirect query param
5. (Optional) Refresh Token:
   - Before token expires, call /auth/refresh with refreshToken
   - Get new access token silently
```

**Password Security**:

```typescript
// src/utils/crypto.ts

import CryptoJS from 'crypto-js'

/**
 * SHA256 password encryption
 * @param password Plain text password
 * @returns Hashed password
 */
export function encryptPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}

// Usage in Login component:
const handleLogin = async () => {
  const encryptedPassword = encryptPassword(loginForm.password)
  await authApi.login({
    username: loginForm.username,
    password: encryptedPassword
  })
}
```

### 5.2 Authorization Strategy (RBAC)

**Role-Based Access Control (RBAC)**:

```
User → Roles → Permissions → Resources

Example:
  Admin User
    ├─ ROLE_ADMIN
    │   └─ Permissions: *:*:* (All permissions)
    │
  Operator User
    ├─ ROLE_OPERATOR
    │   ├─ service:read, service:write
    │   ├─ user:read
    │   └─ menu:read
    │
  Viewer User
    └─ ROLE_VIEWER
        └─ Permissions: *:read (Read-only)
```

**Permission Levels**:

1. **Route Level** (路由级权限):
   - `router.beforeEach()` checks `route.meta.roles`
   - If user doesn't have required role → Redirect to 403

2. **Menu Level** (菜单级权限):
   - Filter menu items based on `meta.roles`
   - Hide menu items user doesn't have permission to access

3. **Button Level** (按钮级权限):
   - Custom directive `v-permission`
   - Remove DOM element if user doesn't have permission

4. **API Level** (API级权限):
   - **Backend responsibility** (final authority)
   - Frontend permission checks are for UX optimization only

### 5.3 Router Guard Implementation

```typescript
// src/router/permission.ts

import router from './index'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404', '/403']  // 白名单路由 (无需登录)

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const hasToken = userStore.token

  if (hasToken) {
    // 已登录
    if (to.path === '/login') {
      // 已登录访问登录页 → 重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查是否已获取用户信息
      if (userStore.roles.length === 0) {
        try {
          // 1. 获取用户信息和权限
          await userStore.getUserInfo()

          // 2. 根据权限生成可访问路由
          const accessRoutes = await permissionStore.generateRoutes(userStore.roles)

          // 3. 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // 4. 重新导航到目标页面 (确保动态路由已添加)
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败 → 清除Token并跳转登录页
          await userStore.logout()
          ElMessage.error('获取用户信息失败，请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        // 已有用户信息 → 检查路由权限
        if (hasPermission(to, userStore.roles)) {
          next()
        } else {
          // 无权限访问 → 跳转403
          next({ path: '/403' })
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 白名单路由直接放行
      next()
    } else {
      // 其他路由 → 重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * Check if user has permission to access route
 * @param route Target route
 * @param userRoles User's roles
 * @returns true if has permission, false otherwise
 */
function hasPermission(route: RouteLocationNormalized, userRoles: string[]): boolean {
  if (route.meta?.roles) {
    // Route requires specific roles
    return userRoles.some(role => route.meta.roles!.includes(role))
  } else {
    // Route has no role restrictions
    return true
  }
}
```

### 5.4 Permission Directive

```typescript
// src/directives/permission.ts

import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * v-permission directive
 * Usage: <el-button v-permission="['user:write']">编辑</el-button>
 * Usage: <el-button v-permission="['user:delete']" type="danger">删除</el-button>
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserStore()

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermission = userStore.permissions.some(permission =>
        value.includes(permission)
      )

      if (!hasPermission) {
        // 移除无权限的元素
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('v-permission directive requires an array of permissions')
    }
  }
}

// Register directive globally
// src/main.ts
import { permission } from '@/directives/permission'

app.directive('permission', permission)
```

### 5.5 XSS/CSRF Prevention

**XSS (Cross-Site Scripting) Prevention**:

1. **Vue Template Escaping** (Built-in):
   - Vue automatically escapes interpolations: `{{ userInput }}` is safe
   - ⚠️ Avoid `v-html` unless content is sanitized

2. **Content Security Policy (CSP)**:
   ```html
   <!-- index.html -->
   <meta http-equiv="Content-Security-Policy" content="
     default-src 'self';
     script-src 'self' 'unsafe-inline' 'unsafe-eval';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data: https:;
   ">
   ```

3. **Input Validation**:
   ```typescript
   // Sanitize user input before displaying
   import DOMPurify from 'dompurify'

   const sanitizedHTML = DOMPurify.sanitize(userInput)
   ```

**CSRF (Cross-Site Request Forgery) Prevention**:

1. **SameSite Cookie** (Backend responsibility):
   ```http
   Set-Cookie: token=...; SameSite=Strict; Secure; HttpOnly
   ```

2. **CSRF Token** (Optional, if backend requires):
   ```typescript
   // Add CSRF token to request headers
   axios.defaults.headers.common['X-CSRF-Token'] = getCsrfToken()
   ```

### 5.6 Environment Variables Security

**Environment Configuration**:

```bash
# .env.development
VITE_APP_TITLE=陪玩服务平台-管理后台
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_MOCK_ENABLED=true

# .env.production
VITE_APP_TITLE=陪玩服务平台-管理后台
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_MOCK_ENABLED=false
```

**❌ Constitution Violation Detection**:

```bash
# ❌ WRONG - Hardcoded secrets in code
const API_KEY = 'sk-1234567890abcdef'  // VIOLATION: Article III

# ✅ CORRECT - Use environment variables
const API_KEY = import.meta.env.VITE_API_KEY
```

**.env.local** (Not committed to Git):

```bash
# .env.local (add to .gitignore)
VITE_API_KEY=sk-1234567890abcdef  # Real API key (not committed)
```

**.gitignore**:

```
.env.local
.env.*.local
```

---

## 6. Performance Optimization

### 6.1 Performance Targets (from PRD NFR)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Initial Load Time** | < 2s | 首次加载时间 (3G网络) |
| **Bundle Size** | < 2.5MB | Gzipped总大小 (JS + CSS) |
| **Time to Interactive (TTI)** | < 3s | 可交互时间 |
| **Lighthouse Performance Score** | ≥ 90 | Chrome Lighthouse |
| **First Contentful Paint (FCP)** | < 1.5s | 首次内容绘制 |
| **API Response Time** | < 500ms | Backend API响应时间 (P95) |

### 6.2 Code-Level Optimizations

#### Route Lazy Loading (路由懒加载)

```typescript
// src/router/index.ts

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    // ✅ Lazy loading - component is loaded only when route is visited
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/users/index.vue'),
    meta: { title: '用户管理' }
  }
]
```

**Vite Build Output** (with code splitting):

```
dist/assets/
  ├─ index-abc123.js          # Main bundle (entry)
  ├─ Dashboard-def456.js      # Dashboard chunk
  ├─ Users-ghi789.js          # Users chunk
  └─ vendor-jkl012.js         # Third-party libs (Element Plus, Vue, etc.)
```

#### Component Async Loading (组件懒加载)

```typescript
// src/views/dashboard/index.vue

import { defineAsyncComponent } from 'vue'

// ✅ Heavy component loaded only when needed
const HeavyChart = defineAsyncComponent(() => import('@/components/HeavyChart.vue'))

// ✅ With loading state
const HeavyTable = defineAsyncComponent({
  loader: () => import('@/components/HeavyTable.vue'),
  loadingComponent: () => h('div', 'Loading...'),
  delay: 200,  // Show loading after 200ms
  timeout: 3000  // Timeout after 3s
})
```

#### Virtual Scrolling (虚拟滚动)

```typescript
// For long lists (1000+ items), use virtual scrolling

// Option 1: Element Plus Virtual List
<el-table-v2
  :columns="columns"
  :data="largeDataList"
  :width="800"
  :height="600"
/>

// Option 2: vue-virtual-scroller (if not using Element Plus table)
<RecycleScroller
  :items="largeList"
  :item-size="50"
  key-field="id"
  v-slot="{ item }"
>
  <div class="list-item">{{ item.name }}</div>
</RecycleScroller>
```

### 6.3 Network-Level Optimizations

#### API Response Caching

```typescript
// src/utils/request.ts

import { setupCache } from 'axios-cache-interceptor'

// Enable caching for GET requests
const service = setupCache(axios.create({ baseURL, timeout }), {
  ttl: 5 * 60 * 1000,  // Cache for 5 minutes
  methods: ['get'],
  cachePredicate: {
    statusCheck: (status) => status >= 200 && status < 300
  }
})

// Usage: Dictionary data (roles, statuses) can be cached
const getRoles = () => request.get('/roles', { cache: { ttl: 30 * 60 * 1000 } })  // 30 min cache
```

#### Image Optimization

```html
<!-- ✅ Lazy loading images -->
<img src="/avatar.jpg" loading="lazy" alt="User Avatar" />

<!-- ✅ WebP format with fallback -->
<picture>
  <source srcset="/avatar.webp" type="image/webp">
  <img src="/avatar.jpg" alt="User Avatar">
</picture>

<!-- ✅ Responsive images -->
<img
  srcset="/avatar-small.jpg 400w, /avatar-large.jpg 800w"
  sizes="(max-width: 600px) 400px, 800px"
  src="/avatar-large.jpg"
  alt="User Avatar"
/>
```

### 6.4 Build-Level Optimizations

#### Vite Build Configuration

```typescript
// vite.config.ts

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // Disable sourcemap in production
    minify: 'terser',  // Minification
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['axios', 'crypto-js', 'dayjs']
        },
        // Asset file naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000  // Warn if chunk > 1MB
  }
})
```

#### Element Plus Tree Shaking (按需导入)

```typescript
// vite.config.ts

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
})
```

**Result**: Only used Element Plus components are bundled (减少 ~200KB)

### 6.5 Runtime Optimizations

#### Keep-Alive (组件缓存)

```typescript
// src/layout/components/AppMain.vue

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
const cachedViews = computed(() => {
  // Only cache views with meta.noCache !== true
  return permissionStore.routes
    .filter(route => !route.meta?.noCache)
    .map(route => route.name)
})
</script>
```

#### Debounce & Throttle

```typescript
// src/utils/common.ts

import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// Debounce: Wait for user to stop typing before search
const debouncedSearch = useDebounceFn((keyword: string) => {
  searchApi(keyword)
}, 500)

// Throttle: Limit scroll event frequency
const throttledScroll = useThrottleFn(() => {
  handleScroll()
}, 200)
```

---

## 7. Testing Strategy

### 7.1 Test Pyramid

```
        E2E Tests (5%)           ← Playwright (RM-011后考虑)
       ／           \              测试用户完整流程
      ／             \
   Integration (15%)  ← Vitest + @vue/test-utils
   ／                 \  测试组件交互、Store集成
  ／                   \
Unit Tests (80%)        ← Vitest
                         测试工具函数、Store Actions、单个组件
```

**Target Coverage**: ≥80% (Constitution Article I.1)

### 7.2 Unit Testing (Vitest)

#### Test Configuration

```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',  // Lightweight DOM for Vue components
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/mock/',
        '**/*.spec.ts',
        '**/*.d.ts'
      ],
      statements: 80,  // Minimum 80% coverage
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

#### Utils Testing Example

```typescript
// tests/unit/utils/validate.spec.ts

import { describe, it, expect } from 'vitest'
import { isValidUsername, isValidEmail, isValidPassword } from '@/utils/validate'

describe('Validate Utils', () => {
  describe('isValidUsername', () => {
    it('should return true for valid username', () => {
      expect(isValidUsername('admin')).toBe(true)
      expect(isValidUsername('user123')).toBe(true)
      expect(isValidUsername('test_user')).toBe(true)
    })

    it('should return false for invalid username', () => {
      expect(isValidUsername('ab')).toBe(false)  // Too short
      expect(isValidUsername('a'.repeat(17))).toBe(false)  // Too long
      expect(isValidUsername('user@123')).toBe(false)  // Invalid char
    })
  })

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true)
    })

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('should return true for valid password', () => {
      expect(isValidPassword('123456')).toBe(true)
      expect(isValidPassword('password123')).toBe(true)
    })

    it('should return false for invalid password', () => {
      expect(isValidPassword('12345')).toBe(false)  // Too short
      expect(isValidPassword('a'.repeat(21))).toBe(false)  // Too long
    })
  })
})
```

#### Store Testing Example

```typescript
// tests/unit/stores/user.spec.ts

import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'
import type { LoginResponse } from '@/types'

// Mock authApi
vi.mock('@/api/auth')

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should login successfully', async () => {
    const store = useUserStore()
    const mockResponse: LoginResponse = {
      token: 'test-token-123',
      user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        roles: [{ id: '1', name: 'admin', code: 'ROLE_ADMIN', permissions: [] }],
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      },
      permissions: ['*:*:*'],
      expiresIn: 7200
    }

    vi.mocked(authApi.login).mockResolvedValue(mockResponse)

    await store.login({ username: 'admin', password: 'hashed-password' })

    expect(store.token).toBe('test-token-123')
    expect(store.userInfo).toEqual(mockResponse.user)
    expect(store.roles).toEqual(['ROLE_ADMIN'])
    expect(store.permissions).toEqual(['*:*:*'])
  })

  it('should logout and clear state', () => {
    const store = useUserStore()
    // Set initial state
    store.token = 'test-token'
    store.userInfo = { id: '1', username: 'admin' } as any
    store.roles = ['ROLE_ADMIN']
    store.permissions = ['*:*:*']

    store.logout()

    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
    expect(store.roles).toEqual([])
    expect(store.permissions).toEqual([])
  })

  it('should check if user has permission', () => {
    const store = useUserStore()
    store.permissions = ['user:read', 'service:write']

    expect(store.hasPermission('user:read')).toBe(true)
    expect(store.hasPermission('service:write')).toBe(true)
    expect(store.hasPermission('user:delete')).toBe(false)
  })
})
```

### 7.3 Component Testing

```typescript
// tests/unit/components/LoginForm.spec.ts

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import LoginForm from '@/views/login/components/LoginForm.vue'
import { ElMessage } from 'element-plus'

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render login form with username and password inputs', () => {
    const wrapper = mount(LoginForm)

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should show validation error for empty username', async () => {
    const wrapper = mount(LoginForm)

    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')

    expect(wrapper.text()).toContain('请输入用户名')
  })

  it('should submit form with valid credentials', async () => {
    const wrapper = mount(LoginForm)

    // Fill form
    await wrapper.find('input[type="text"]').setValue('admin')
    await wrapper.find('input[type="password"]').setValue('123456')

    // Submit
    await wrapper.find('button[type="submit"]').trigger('click')

    // Wait for async operations
    await wrapper.vm.$nextTick()

    // Check if login action was called (mock authApi in real test)
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
```

### 7.4 TDD Workflow (Constitution Article IV)

**Mandatory Sequence in TASKS.md**:

```markdown
## User Story 1: 项目初始化与基础配置

### TEST TASKS
- [ ] T001: Write unit tests for environment variable loading (import.meta.env)
  - Test: VITE_API_BASE_URL is loaded correctly
  - Test: VITE_MOCK_ENABLED is boolean
  - Test: Missing env var returns undefined

- [ ] T002: Write integration tests for Vite dev server startup
  - Test: Dev server starts on port 5173
  - Test: HMR connection established
  - Test: Entry HTML is served

### TEST VERIFICATION CHECKPOINT
→ Run: npm run test
→ Expected: ALL tests above FAIL (functions not implemented yet)
→ Blocker: Cannot proceed to implementation until tests fail

### IMPLEMENTATION TASKS
- [ ] T003: Create Vite project with Vue 3 + TypeScript template
  - Run: npm create vite@latest vue-admin -- --template vue-ts
  - Configure: tsconfig.json, vite.config.ts

- [ ] T004: Configure environment variables
  - Create: .env.development, .env.production
  - Add: VITE_API_BASE_URL, VITE_MOCK_ENABLED
  - Update: vite-env.d.ts with type definitions

### TEST VERIFICATION CHECKPOINT
→ Run: npm run test
→ Expected: ALL tests above PASS
→ Coverage: Check coverage report (should be >80%)
```

**TDD Cycle**:

```
1. Write Test (Red)
   ├─ Define test case
   ├─ Write assertions
   └─ Run test → ❌ FAIL

2. Implement Code (Green)
   ├─ Write minimal code to pass test
   ├─ Run test → ✅ PASS
   └─ Verify all tests still pass

3. Refactor (Refactor)
   ├─ Improve code quality
   ├─ Remove duplication
   ├─ Run test → ✅ PASS
   └─ Ensure no regression

4. Repeat for next test case
```

### 7.5 CI Integration (Future - RM-011)

```yaml
# .github/workflows/test.yml

name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Run linter
        run: npm run lint

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Check coverage threshold
        run: |
          COVERAGE=$(node -p "require('./coverage/coverage-summary.json').total.lines.pct")
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi
```

---

## 8. Development Workflow

### 8.1 Recommended Project Structure

```
vue-admin/
├── public/                       # 静态资源 (不经过Vite处理)
│   └── favicon.ico
│
├── src/
│   ├── api/                      # API服务层
│   │   ├── auth.ts               # 认证API
│   │   ├── user.ts               # 用户API
│   │   ├── menu.ts               # 菜单API
│   │   └── types.ts              # API类型定义
│   │
│   ├── assets/                   # 资源文件 (经过Vite处理)
│   │   ├── icons/                # SVG图标
│   │   │   ├── svg/              # 原始SVG文件
│   │   │   └── index.ts          # 图标注册
│   │   ├── images/               # 图片资源
│   │   └── styles/               # 全局样式
│   │       ├── index.scss        # 入口样式
│   │       ├── variables.scss    # 变量定义
│   │       └── transition.scss   # 过渡动画
│   │
│   ├── components/               # 通用组件
│   │   ├── SvgIcon/              # SVG图标组件
│   │   │   └── index.vue
│   │   ├── Pagination/           # 分页组件
│   │   │   └── index.vue
│   │   ├── Breadcrumb/           # 面包屑组件
│   │   │   └── index.vue
│   │   └── Hamburger/            # 汉堡菜单按钮
│   │       └── index.vue
│   │
│   ├── directives/               # 自定义指令
│   │   ├── index.ts              # 指令注册
│   │   ├── permission.ts         # 权限指令 v-permission
│   │   └── loading.ts            # 加载指令 v-loading
│   │
│   ├── layout/                   # 布局组件
│   │   ├── index.vue             # 布局入口
│   │   └── components/           # 布局子组件
│   │       ├── Sidebar/          # 侧边栏
│   │       │   ├── index.vue
│   │       │   ├── SidebarItem.vue
│   │       │   └── SidebarLogo.vue
│   │       ├── Navbar/           # 顶部导航栏
│   │       │   └── index.vue
│   │       ├── AppMain/          # 主内容区
│   │       │   └── index.vue
│   │       └── TagsView/         # 标签页 (可选)
│   │           └── index.vue
│   │
│   ├── mock/                     # Mock数据
│   │   ├── auth.ts               # 认证Mock
│   │   ├── user.ts               # 用户Mock
│   │   └── menu.ts               # 菜单Mock
│   │
│   ├── router/                   # 路由配置
│   │   ├── index.ts              # 路由实例
│   │   ├── routes.ts             # 路由表定义
│   │   └── permission.ts         # 路由守卫
│   │
│   ├── stores/                   # Pinia Store
│   │   ├── user.ts               # 用户状态
│   │   ├── app.ts                # 应用状态
│   │   ├── permission.ts         # 权限状态
│   │   └── index.ts              # Store注册
│   │
│   ├── types/                    # TypeScript类型定义
│   │   ├── api/                  # API类型
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   └── common.ts
│   │   ├── user.ts               # 用户实体
│   │   ├── menu.ts               # 菜单实体
│   │   └── global.d.ts           # 全局类型声明
│   │
│   ├── utils/                    # 工具函数
│   │   ├── request.ts            # Axios封装
│   │   ├── validate.ts           # 校验函数
│   │   ├── permission.ts         # 权限判断
│   │   ├── storage.ts            # LocalStorage封装
│   │   ├── crypto.ts             # 加密工具
│   │   └── common.ts             # 通用工具
│   │
│   ├── views/                    # 页面组件
│   │   ├── login/                # 登录页
│   │   │   ├── index.vue
│   │   │   └── components/       # 登录页子组件
│   │   │       └── LoginForm.vue
│   │   ├── dashboard/            # Dashboard
│   │   │   └── index.vue
│   │   └── error/                # 错误页面
│   │       ├── 403.vue           # 无权限
│   │       └── 404.vue           # 未找到
│   │
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 入口文件
│   └── vite-env.d.ts             # Vite环境变量类型
│
├── tests/                        # 测试文件
│   ├── unit/                     # 单元测试
│   │   ├── utils/                # 工具函数测试
│   │   ├── stores/               # Store测试
│   │   └── components/           # 组件测试
│   └── integration/              # 集成测试
│
├── .env.development              # 开发环境变量
├── .env.production               # 生产环境变量
├── .eslintrc.cjs                 # ESLint配置
├── .prettierrc.json              # Prettier配置
├── .gitignore                    # Git忽略文件
├── index.html                    # HTML入口
├── package.json                  # 依赖清单
├── tsconfig.json                 # TypeScript配置
├── tsconfig.node.json            # TypeScript Node配置
├── vite.config.ts                # Vite配置
├── vitest.config.ts              # Vitest配置
└── README.md                     # 项目文档
```

### 8.2 npm Scripts

```json
// package.json

{
  "name": "vue-admin",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,ts,vue,json,css,scss}\"",
    "type-check": "vue-tsc --noEmit"
  }
}
```

**Script Usage**:
- `npm run dev`: 启动开发服务器 (http://localhost:5173)
- `npm run build`: 构建生产环境代码 (输出到 dist/)
- `npm run preview`: 预览构建结果
- `npm run test`: 运行测试 (watch模式)
- `npm run test:coverage`: 运行测试并生成覆盖率报告
- `npm run lint`: 运行ESLint并自动修复
- `npm run format`: 运行Prettier格式化代码
- `npm run type-check`: 运行TypeScript类型检查 (不生成文件)

### 8.3 Git Workflow

**Branch Strategy**:

```
main (生产环境)
  ├─ develop (开发环境)
  │   ├─ feature/RM-004-project-init (Story 1)
  │   ├─ feature/RM-004-element-plus (Story 2)
  │   ├─ feature/RM-004-layout (Story 3)
  │   └─ ...
```

**Branch Naming Convention**:
- `feature/RM-004-{story-name}`: 功能分支
- `bugfix/RM-004-{bug-description}`: 修复分支
- `hotfix/{issue-number}`: 紧急修复分支

**Commit Message Convention**:

```
feat(RM-004): implement login page with JWT authentication

- Add LoginForm component with email/password inputs
- Add password encryption with SHA256
- Add JWT token management in userStore
- Add login API integration with Mock data

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

### 8.4 Code Review Checklist

**Before Submitting PR**:

1. ✅ **Tests Pass**: `npm run test` 通过
2. ✅ **Coverage ≥80%**: 检查覆盖率报告
3. ✅ **Type Check**: `npm run type-check` 无错误
4. ✅ **Linting**: `npm run lint` 无警告
5. ✅ **Build Success**: `npm run build` 成功
6. ✅ **No Console Logs**: 移除所有 `console.log`
7. ✅ **No TODOs**: 移除所有 `TODO` 注释
8. ✅ **No Hardcoded Secrets**: 检查环境变量使用

**During Code Review**:

1. **Functionality**: 功能是否符合PRD要求?
2. **Test Coverage**: 是否有足够的测试覆盖关键逻辑?
3. **Code Quality**: 代码是否清晰、易读、易维护?
4. **Performance**: 是否有性能问题 (大循环、内存泄漏)?
5. **Security**: 是否有安全隐患 (XSS, 硬编码密钥)?
6. **Constitution**: 是否符合宪法要求 (无抽象层、简洁性)?

---

## 9. Build & Deployment

### 9.1 Vite Build Configuration

```typescript
// vite.config.ts

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: '/',  // Public base path
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts'
      }),
      viteMockServe({
        mockPath: 'src/mock',
        enable: env.VITE_MOCK_ENABLED === 'true',
        watchFiles: true,
        logger: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      proxy: {
        // Proxy API requests to backend (when Mock is disabled)
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'utils': ['axios', 'crypto-js']
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000
    }
  }
})
```

### 9.2 Build Output Structure

```
dist/
├── assets/                       # Processed assets
│   ├── css/
│   │   └── index-abc123.css      # Bundled CSS (~50KB gzipped)
│   └── js/
│       ├── index-def456.js       # Main bundle (~200KB gzipped)
│       ├── element-plus-ghi789.js  # Element Plus chunk (~150KB gzipped)
│       ├── vue-vendor-jkl012.js  # Vue + Router + Pinia (~100KB gzipped)
│       └── utils-mno345.js       # Utils chunk (~50KB gzipped)
│
├── index.html                    # Entry HTML
└── favicon.ico                   # Favicon

Total Size: ~550KB gzipped (< 2.5MB uncompressed)
```

**Size Optimization Results**:
- Element Plus tree-shaking: 减少 ~200KB
- Code splitting: 并行加载，减少初始加载时间
- Gzip compression: 减少 ~70% 文件大小

### 9.3 Environment Variables

```bash
# .env (base, committed to Git)
VITE_APP_TITLE=陪玩服务平台-管理后台

# .env.development (committed to Git)
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_MOCK_ENABLED=true

# .env.production (committed to Git)
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_MOCK_ENABLED=false

# .env.local (NOT committed to Git, override for local development)
VITE_API_BASE_URL=http://192.168.1.100:8080/api/v1
```

**TypeScript Type Definitions**:

```typescript
// src/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_MOCK_ENABLED: string  // 'true' or 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 9.4 Deployment (RM-011 Scope)

**Static Hosting Options**:
- Nginx (推荐)
- Apache
- Vercel / Netlify (用于演示)

**Nginx Configuration Example**:

```nginx
server {
    listen 80;
    server_name admin.example.com;

    root /var/www/vue-admin/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML files - no cache
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Fallback to index.html for SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass https://api.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 10. Dependencies Management

### 10.1 Core Dependencies

```json
{
  "name": "vue-admin",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.5.0",
    "pinia": "^2.3.0",
    "pinia-plugin-persistedstate": "^4.1.0",
    "element-plus": "^2.9.0",
    "@element-plus/icons-vue": "^2.3.0",
    "axios": "^1.7.0",
    "crypto-js": "^4.2.0",
    "nprogress": "^0.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "vue-tsc": "^2.0.0",
    "vitest": "^2.0.0",
    "@vue/test-utils": "^2.4.0",
    "@vitest/coverage-v8": "^2.0.0",
    "happy-dom": "^14.0.0",
    "vite-plugin-mock": "^3.0.0",
    "mockjs": "^1.1.0",
    "@types/mockjs": "^1.0.10",
    "@types/crypto-js": "^4.2.0",
    "@types/nprogress": "^0.2.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "eslint-plugin-vue": "^9.0.0",
    "prettier": "^3.0.0",
    "unplugin-auto-import": "^0.18.0",
    "unplugin-vue-components": "^0.27.0",
    "sass": "^1.80.0"
  }
}
```

### 10.2 Version Lock Strategy

**Semantic Versioning**:
- `^3.5.0`: 允许小版本和补丁更新 (3.5.x, 3.6.x, ... 3.9.x ✅ | 4.0.0 ❌)
- `~3.5.0`: 仅允许补丁更新 (3.5.0, 3.5.1, ... 3.5.x ✅ | 3.6.0 ❌)
- `3.5.0`: 锁定确切版本 (仅用于已知有兼容性问题的库)

**Lock File**: `package-lock.json` or `pnpm-lock.yaml` 必须提交到Git

**Dependency Upgrade Strategy**:
1. **Major Version**: 升级前阅读CHANGELOG，在feature分支测试，确认无Breaking Changes
2. **Minor Version**: 定期升级 (每季度)，运行完整测试套件
3. **Patch Version**: 安全补丁立即升级

### 10.3 Bundle Size Analysis

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,  // 自动打开报告
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ]
})

# Build and generate report
npm run build
# Opens dist/stats.html in browser
```

**Expected Bundle Sizes** (gzipped):
- `vue-vendor.js`: ~100KB (Vue 3 + Router + Pinia)
- `element-plus.js`: ~150KB (Element Plus components used)
- `utils.js`: ~50KB (Axios, crypto-js, etc.)
- `index.js`: ~200KB (Application code)
- `index.css`: ~50KB (Styles)
- **Total**: ~550KB (< 2.5MB target ✅)

---

## 11. Risk Assessment

### 11.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Element Plus版本更新导致Breaking Changes** | High | Low | 锁定版本 ^2.9.0，升级前在测试环境验证，关注官方CHANGELOG和Migration Guide |
| **Mock数据与Backend API不一致** | High | Medium | RM-010阶段先定义OpenAPI规范，Mock数据严格遵守契约，联调前执行契约测试 (Pact.js) |
| **TypeScript any类型泛滥** | Medium | Medium | ESLint规则强制禁止any (`@typescript-eslint/no-explicit-any: error`)，Code Review严格检查 |
| **测试覆盖率不达标 (<80%)** | High | Low | CI集成coverage check，低于80%阻止合并，定期Review coverage报告 |
| **权限系统过度设计** | Medium | Low | 遵循Constitution Article VII (Simplicity Gate)，仅实现RBAC，避免ABAC |
| **前端直接暴露敏感信息** | High | Low | Code Review检查硬编码密钥，所有敏感配置使用环境变量，Git Hook阻止.env.local提交 |
| **Vite 7新版本兼容性问题** | Medium | Low | 使用稳定版本 (7.0.0+)，关注官方issue tracker，测试环境充分验证 |
| **浏览器兼容性问题** | Low | Low | 目标浏览器明确 (Chrome/Edge/Firefox 90+)，使用Browserslist配置，无需兼容IE11 |

### 11.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **后续管理页面需求变更，框架需要返工** | High | Medium | 框架设计预留扩展接口 (路由动态添加、权限灵活配置)，采用模块化设计，降低耦合度 |
| **运营人员对Element Plus组件风格不满意** | Medium | Low | 提前提供UI_PROTOTYPE.html供预览，收集反馈后再开发后续页面，Element Plus支持主题定制 |
| **团队对Vue 3 Composition API不熟悉** | Medium | Medium | 提供培训文档和示例代码，Code Review阶段互相学习，参考vue3-element-admin项目 |
| **开发进度延期** | Medium | Low | 分Story并行开发，优先完成MVP (Story 1-8)，Story 9 (Dashboard) 可延后 |

### 11.3 Compliance Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **违反Constitution Article I (Quality First)** | High | CI强制执行测试覆盖率≥80%，Code Review检查无TODO、无partial implementation |
| **违反Constitution Article III (Security Standards)** | High | Git Hook检查硬编码secrets，Code Review验证环境变量使用，定期安全审计 |
| **违反Constitution Article IV (TDD)** | High | TASKS.md强制TDD顺序，devflow-tdd-enforcer skill实时检查，不通过TEST CHECKPOINT不允许实现 |
| **违反Constitution Article VI (Anti-Abstraction)** | Medium | Code Review检查是否有BaseController、AbstractService等抽象层，直接使用Vue Router、Axios |
| **违反Constitution Article VII (Simplicity Gate)** | Medium | 架构设计限制≤3层 (View → Store → API Service)，禁止引入未在research.md中的技术 |

---

## 12. Constitution Compliance

### 12.1 Phase -1 Gates Verification

#### Simplicity Gate (简洁性门控)

**Rule**: 解决方案不超过3个主要模块/项目

**Compliance**:
```
✅ View Layer (Vue Components)
✅ State Management Layer (Pinia Stores)
✅ API Service Layer (Axios + Mock)

Total: 3 layers ✅
```

**No Over-Engineering**:
- ✅ 直接使用Vue Router (无自定义router wrapper)
- ✅ 直接使用Element Plus (无BaseComponent抽象)
- ✅ 直接使用Axios (minimal request wrapper)
- ✅ RBAC权限模型 (无ABAC过度设计)

#### Anti-Abstraction Gate (反抽象门控)

**Rule**: 无自定义抽象层，直接使用框架

**Compliance**:
```
✅ Vue Router 4: 直接使用，无自定义router wrapper
✅ Pinia: 直接定义Store，无BaseStore抽象
✅ Element Plus: 直接使用组件，无BaseComponent
✅ Axios: Minimal interceptor封装，无AbstractHttpClient
```

**Rejected Patterns**:
- ❌ BaseController (不需要，直接在component中调用API)
- ❌ AbstractService (不需要，直接在Pinia action中调用API)
- ❌ GenericRepository (不需要，前端无ORM概念)
- ❌ CustomRouterWrapper (不需要，Vue Router功能已足够)

#### Integration-First Gate (集成优先门控)

**Rule**: API契约先行，Mock遵守契约

**Compliance**:
```
✅ API契约定义: RESTful conventions (Section 4.1)
✅ Mock数据结构: 严格遵循ApiResponse<T>格式
✅ Request/Response Types: TypeScript interfaces定义 (Section 3.2)
✅ 联调准备: Mock数据与Backend API 1:1对应
```

**Mock → Backend Migration Path**:
```typescript
// Development (Mock enabled)
VITE_MOCK_ENABLED=true
VITE_API_BASE_URL=http://localhost:8080/api/v1  // Not used, intercepted by Mock

// Integration (Mock disabled, use real API)
VITE_MOCK_ENABLED=false
VITE_API_BASE_URL=http://localhost:8080/api/v1  // Real backend

// Production
VITE_MOCK_ENABLED=false
VITE_API_BASE_URL=https://api.example.com/api/v1
```

### 12.2 Constitutional Articles Compliance

#### Article I: Quality First (质量优先)

**I.1 - Test Coverage ≥80%**:
```bash
# vitest.config.ts enforces coverage threshold
coverage: {
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80
}

# CI blocks merge if coverage < 80%
```

**I.2 - No Partial Implementation**:
```typescript
// ❌ WRONG - Partial implementation with TODO
function calculateTotal() {
  // TODO: Add tax calculation
  return subtotal
}

// ✅ CORRECT - Complete implementation
function calculateTotal(subtotal: number, taxRate: number): number {
  const tax = subtotal * taxRate
  return subtotal + tax
}
```

**I.3 - Mandatory Testing**:
- ✅ Unit tests for all utils, stores, composables
- ✅ Component tests for key components (LoginForm, Sidebar, etc.)
- ✅ Integration tests for Store + API interactions

#### Article III: Security Standards (安全标准)

**III.1 - NO HARDCODED SECRETS**:
```typescript
// ❌ WRONG - Hardcoded secret
const API_KEY = 'sk-1234567890abcdef'

// ✅ CORRECT - Environment variable
const API_KEY = import.meta.env.VITE_API_KEY
```

**III.2 - Secure Password Handling**:
```typescript
// ✅ Password encrypted before transmission
import { encryptPassword } from '@/utils/crypto'

const handleLogin = async () => {
  const encryptedPassword = encryptPassword(loginForm.password)  // SHA256
  await authApi.login({ username, password: encryptedPassword })
}
```

**III.3 - XSS Prevention**:
```vue
<!-- ✅ Vue auto-escapes interpolations -->
<div>{{ userInput }}</div>

<!-- ⚠️ Avoid v-html unless content is sanitized -->
<div v-html="sanitizedHTML"></div>
```

#### Article IV: Test-First Development (TDD)

**IV.1 - Tests Before Implementation**:
```markdown
## User Story 1: 项目初始化与基础配置

### TEST TASKS
- [ ] T001: Write unit tests for environment variable loading
- [ ] T002: Write integration tests for Vite dev server startup

### TEST VERIFICATION CHECKPOINT
→ ALL tests above MUST fail before proceeding

### IMPLEMENTATION TASKS
- [ ] T003: Create Vite project with Vue 3 + TypeScript template
- [ ] T004: Configure environment variables
```

**IV.2 - Test Verification Checkpoint**:
- ✅ Tests written first → Run → Verify FAIL
- ✅ Implementation → Run → Verify PASS
- ✅ devflow-tdd-enforcer skill blocks violations

#### Article VI: Anti-Abstraction (反抽象)

**VI.1 - Use Frameworks Directly**:
```typescript
// ✅ Direct usage of Vue Router
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/dashboard')

// ✅ Direct usage of Pinia
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
userStore.login(credentials)

// ✅ Direct usage of Axios
import request from '@/utils/request'
request.post('/auth/login', data)
```

**VI.2 - No Unnecessary Abstractions**:
- ❌ BaseController, AbstractService, GenericRepository
- ❌ CustomHttpClient wrapping Axios
- ❌ RouteFactory wrapping Vue Router
- ✅ Minimal utility wrappers (request interceptor OK)

#### Article VII: Simplicity Gate (简洁性门控)

**VII.1 - Maximum 3 Layers**:
```
View (Vue Components)
  ↓
State Management (Pinia Stores)
  ↓
API Service (Axios + Mock)

✅ Total: 3 layers
```

**VII.2 - No Future-Proofing**:
- ❌ 暗色模式 (Dark Mode) - Not in PRD, out of scope
- ❌ 国际化 (i18n) - PRD明确"仅支持中文"
- ❌ 移动端响应式 - PRD明确"桌面端为主"
- ✅ Implement ONLY what PRD specifies

#### Article X: Requirement Boundary (需求边界)

**X.1 - Implement ONLY PRD User Stories**:
```
✅ Story 1: 项目初始化与基础配置
✅ Story 2: UI组件库集成
✅ Story 3: 布局系统实现
✅ Story 4: 路由系统与权限控制
✅ Story 5: HTTP请求封装
✅ Story 6: Mock数据集成
✅ Story 7: 状态管理
✅ Story 8: 登录页与认证流程
✅ Story 9: Dashboard演示页面

❌ 具体业务页面开发 (RM-005~008负责)
❌ 后端API开发 (RM-009、RM-010负责)
❌ 真实数据对接 (RM-011负责)
❌ 暗色模式、国际化、移动端适配 (out of scope)
```

**X.2 - Mark Ambiguities**:
```markdown
# If requirements are unclear:
[NEEDS CLARIFICATION] Should the login form support "Remember Me" functionality?

# Do not speculate:
❌ "I assume we need Remember Me, so I'll implement it"
✅ "Mark as [NEEDS CLARIFICATION] and ask PM"
```

### 12.3 Final Compliance Checklist

**Pre-Implementation**:
- [x] PRD完整，无{{PLACEHOLDER}}
- [x] Research决策明确 (R001-R010)
- [x] 技术栈基于BASELINE (Vue 3 + Vite + TypeScript + Element Plus)
- [x] 无引入新技术 (Anti-Tech-Creep)
- [x] 架构≤3层 (Simplicity Gate)
- [x] 无自定义抽象层 (Anti-Abstraction Gate)

**During Implementation**:
- [ ] TDD顺序严格执行 (Tests → Verify Fail → Implement → Verify Pass)
- [ ] 测试覆盖率实时监控 (≥80%)
- [ ] 无hardcoded secrets (环境变量)
- [ ] 无partial implementation (无TODO)
- [ ] Code Review检查Constitution compliance

**Post-Implementation**:
- [ ] 所有测试通过
- [ ] 覆盖率≥80%
- [ ] Type Check无错误
- [ ] Lint无警告
- [ ] Build成功，bundle size < 2.5MB
- [ ] Constitution Gate验证通过

---

## Appendix A: Reference Projects

**Primary Reference**: [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin)
- Tech Stack: 100% Match (Vue 3 + Vite + TypeScript + Element Plus + Pinia)
- Features: RBAC, Mock Data, Dynamic Routes
- Quality: Well-documented, Active community

**Secondary References**:
- [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) - Performance optimization patterns
- [vue-manage-system](https://github.com/lin-xin/vue-manage-system) - Simplicity patterns

---

## Appendix B: Code Examples Repository

All code examples in this document are located in:
- `src/api/`: API service examples
- `src/stores/`: Pinia store examples
- `src/utils/`: Utility function examples
- `src/router/`: Router guard examples
- `tests/unit/`: Test examples

---

**Document Status**: ✅ Complete
**Next Steps**:
1. Review and approve TECH_DESIGN.md
2. Use `/flow-epic` to generate EPIC.md and TASKS.md
3. Use `/flow-dev` to begin TDD implementation

**Generated By**: tech-architect agent (CC-DevFlow)
**Template Version**: TECH_DESIGN_TEMPLATE v2.0.0
**Compliance**: Constitution v2.0.0 ✅
