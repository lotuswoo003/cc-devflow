# Codebase Technical Analysis: RM-004

**Generated**: 2025-11-21T17:00:00+08:00
**Requirement**: RM-004 - Vue管理后台框架
**Analysis Scope**: Data models, API patterns, Authentication, Security, Database, Reusable components, Testing

---

## Executive Summary

This technical analysis examines the Vue 3 admin dashboard framework requirements for the 陪玩服务平台 (Companion Service Platform). As a **greenfield project** with no existing Vue codebase, we have the opportunity to establish best practices from the ground up while maintaining consistency with the backend SpringBoot architecture.

**Key Findings**:
1. **Zero Legacy Constraints**: No existing Vue code to migrate or refactor
2. **Backend API Pending**: RM-010 will provide RESTful APIs; Mock-first strategy required
3. **Reference Architecture**: vue3-element-admin provides proven patterns (Research R010)
4. **Constitution Compliance**: Must avoid abstraction layers, use frameworks directly

---

## 1. Data Model Patterns

### 1.1 Frontend Data Models (TypeScript Interfaces)

Based on PRD analysis, we need the following domain entities:

#### Core Entities

```typescript
// 用户实体 (User Entity)
interface User {
  id: string                    // 用户唯一标识
  username: string              // 用户名
  email: string                 // 邮箱
  roles: Role[]                 // 角色列表 (RBAC)
  avatar?: string               // 头像URL
  status: 'active' | 'inactive' | 'locked'  // 状态
  createdAt: Date               // 创建时间
  updatedAt: Date               // 更新时间
}

// 角色实体 (Role Entity)
interface Role {
  id: string                    // 角色ID
  name: string                  // 角色名称 (如: admin, operator, viewer)
  permissions: Permission[]     // 权限列表
  description?: string          // 角色描述
}

// 权限实体 (Permission Entity)
interface Permission {
  id: string                    // 权限ID
  resource: string              // 资源标识 (如: service:read, service:write)
  action: 'read' | 'write' | 'delete' | 'execute'  // 操作类型
}

// 菜单实体 (Menu Entity)
interface MenuItem {
  id: string                    // 菜单ID
  path: string                  // 路由路径
  name: string                  // 路由名称
  component: string             // 组件路径
  meta: MenuMeta                // 元信息
  children?: MenuItem[]         // 子菜单
}

interface MenuMeta {
  title: string                 // 菜单标题
  icon?: string                 // 图标名称
  hidden?: boolean              // 是否隐藏
  roles?: string[]              // 允许访问的角色
  keepAlive?: boolean           // 是否缓存
  breadcrumb?: boolean          // 是否显示面包屑
}
```

#### Request/Response Wrappers

```typescript
// 统一响应格式 (Standard API Response)
interface ApiResponse<T = any> {
  code: number                  // 状态码 (200=成功, 401=未授权, 403=禁止, 500=服务器错误)
  data: T                       // 业务数据
  message: string               // 提示信息
  timestamp: number             // 时间戳
}

// 分页请求参数 (Pagination Request)
interface PageRequest {
  page: number                  // 页码 (从1开始)
  size: number                  // 每页数量
  sort?: string                 // 排序字段
  order?: 'asc' | 'desc'        // 排序方向
}

// 分页响应数据 (Pagination Response)
interface PageResponse<T> {
  list: T[]                     // 数据列表
  total: number                 // 总记录数
  page: number                  // 当前页码
  size: number                  // 每页数量
  pages: number                 // 总页数
}

// 登录请求 (Login Request)
interface LoginRequest {
  username: string              // 用户名或邮箱
  password: string              // 密码 (前端需加密)
  captcha?: string              // 验证码 (可选)
}

// 登录响应 (Login Response)
interface LoginResponse {
  token: string                 // JWT Token
  refreshToken?: string         // 刷新Token (可选)
  user: User                    // 用户信息
  permissions: string[]         // 权限列表 (扁平化)
  expiresIn: number             // 过期时间 (秒)
}
```

### 1.2 State Management Models (Pinia Stores)

```typescript
// User Store State
interface UserState {
  token: string | null          // JWT Token
  userInfo: User | null         // 当前用户信息
  roles: string[]               // 角色列表 (字符串数组)
  permissions: string[]         // 权限列表 (扁平化)
}

// App Store State
interface AppState {
  sidebar: {
    opened: boolean             // 侧边栏是否展开
    withoutAnimation: boolean   // 是否禁用动画
  }
  device: 'desktop' | 'mobile'  // 设备类型
  language: string              // 语言 (默认 zh-CN)
  size: 'default' | 'large' | 'small'  // Element Plus 尺寸
}

// Permission Store State
interface PermissionState {
  routes: MenuItem[]            // 可访问路由列表
  dynamicRoutes: MenuItem[]     // 动态路由 (根据权限过滤)
}
```

### 1.3 Data Flow Patterns

**Authentication Flow**:
```
User Input → Login Form → Axios POST /auth/login → Backend API
  ↓
JWT Token + User Info
  ↓
Store in Pinia (userStore) + LocalStorage (token)
  ↓
Axios Interceptor auto-attach token to all requests
```

**Permission Flow**:
```
User Login → Get Permissions → Store in Pinia
  ↓
Router Guard checks permission before navigation
  ↓
Render menu items based on roles
  ↓
v-permission directive hides buttons without permission
```

---

## 2. API Design Patterns

### 2.1 RESTful API Conventions

**Backend Contract** (待 RM-010 实现):

```
Base URL: /api/v1

Authentication:
  POST   /auth/login              # 登录
  POST   /auth/logout             # 登出
  POST   /auth/refresh            # 刷新Token
  GET    /auth/userinfo           # 获取用户信息

User Management (RM-007 will consume):
  GET    /users?page=1&size=20    # 用户列表 (分页)
  GET    /users/:id               # 用户详情
  POST   /users                   # 创建用户
  PUT    /users/:id               # 更新用户
  DELETE /users/:id               # 删除用户

Menu & Permissions:
  GET    /menus                   # 获取菜单树 (根据当前用户权限)
  GET    /permissions             # 获取权限列表
```

### 2.2 Axios HTTP Client封装

**Request Interceptor** (请求拦截器):
```typescript
// 功能: 自动添加 Token、请求日志、超时控制
axios.interceptors.request.use(
  config => {
    // 1. 从 Pinia userStore 获取 token
    const token = userStore.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 2. 添加请求时间戳 (防缓存)
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }

    // 3. 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  error => Promise.reject(error)
)
```

**Response Interceptor** (响应拦截器):
```typescript
// 功能: 统一错误处理、Token 过期刷新、业务错误提示
axios.interceptors.response.use(
  response => {
    const { code, data, message } = response.data as ApiResponse

    // 1. 业务成功 (code=200)
    if (code === 200) {
      return data  // 直接返回业务数据
    }

    // 2. 业务失败 (code!=200)
    ElMessage.error(message || '操作失败')
    return Promise.reject(new Error(message))
  },
  error => {
    // 3. HTTP 错误处理
    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:  // 未授权 - Token过期或无效
          ElMessage.error('登录已过期，请重新登录')
          userStore.logout()  // 清除本地Token
          router.push('/login')
          break
        case 403:  // 禁止访问 - 权限不足
          ElMessage.error('权限不足，无法访问')
          break
        case 500:  // 服务器错误
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else {
      // 4. 网络错误
      ElMessage.error('网络连接失败，请检查网络')
    }

    return Promise.reject(error)
  }
)
```

### 2.3 API Service Layer组织

**文件结构**:
```
src/api/
├── auth.ts          # 认证相关API
├── user.ts          # 用户管理API
├── menu.ts          # 菜单权限API
└── types.ts         # API类型定义
```

**示例服务** (src/api/auth.ts):
```typescript
import request from '@/utils/request'
import type { LoginRequest, LoginResponse } from './types'

export const authApi = {
  // 登录
  login(data: LoginRequest) {
    return request.post<LoginResponse>('/auth/login', data)
  },

  // 登出
  logout() {
    return request.post('/auth/logout')
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<User>('/auth/userinfo')
  }
}
```

---

## 3. Authentication & Authorization

### 3.1 认证方案: JWT Token

**Token 存储**:
- **Access Token**: LocalStorage (或 SessionStorage)
- **Refresh Token**: LocalStorage (可选，用于静默刷新)
- **UserInfo**: Pinia Store (内存，页面刷新后从 /auth/userinfo 重新获取)

**Token 生命周期**:
```
1. Login → Backend 返回 JWT Token (有效期2小时)
2. 存储到 LocalStorage + Pinia
3. 每次请求通过 Axios Interceptor 自动携带 Token
4. Token 过期 → 401响应 → 清除本地Token → 跳转登录页
5. (可选) Refresh Token 静默刷新
```

### 3.2 权限控制模型: RBAC

**Role-Based Access Control**:
- **角色 (Role)**: admin, operator, viewer
- **权限 (Permission)**: service:read, service:write, user:read, user:write, etc.
- **映射**: User → Roles → Permissions

**权限检查层级**:
1. **路由级**: Router Guard (`router.beforeEach`) - 检查用户是否有访问该路由的权限
2. **菜单级**: 根据 `meta.roles` 过滤菜单显示
3. **按钮级**: 自定义指令 `v-permission` - 隐藏无权限的操作按钮
4. **API级**: Backend 最终权限验证 (前端仅为UX优化)

**实现示例**:

```typescript
// Router Guard (src/router/permission.ts)
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })  // 已登录用户访问登录页，重定向到首页
    } else {
      // 检查是否已获取用户信息
      if (userStore.roles.length === 0) {
        try {
          // 获取用户信息和权限
          await userStore.getUserInfo()
          // 根据权限生成可访问路由
          const accessRoutes = await permissionStore.generateRoutes(userStore.roles)
          // 动态添加路由
          accessRoutes.forEach(route => router.addRoute(route))
          // 重新导航到目标页面
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，清除Token并跳转登录页
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 检查是否有访问权限
        const hasPermission = to.meta.roles
          ? userStore.roles.some(role => to.meta.roles.includes(role))
          : true

        if (hasPermission) {
          next()
        } else {
          next({ path: '/403' })  // 无权限访问，跳转403页面
        }
      }
    }
  } else {
    // 未登录
    if (to.path === '/login') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)  // 重定向到登录页
    }
  }
})

// Button Permission Directive (src/directives/permission.ts)
const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserStore()

    if (value && value.length > 0) {
      const hasPermission = userStore.permissions.some(permission =>
        value.includes(permission)
      )

      if (!hasPermission) {
        el.parentNode?.removeChild(el)  // 移除无权限的按钮
      }
    }
  }
}

// Usage in component:
<el-button v-permission="['user:delete']" type="danger">删除用户</el-button>
```

---

## 4. Security Considerations

### 4.1 Frontend Security Checklist

**✅ Must Implement**:
1. **Password Encryption**: 前端使用 `crypto-js` 进行 SHA256 加密后再发送 (防止明文传输)
2. **XSS Prevention**:
   - 使用 Vue 模板默认转义 (避免 `v-html`)
   - 后端返回的用户输入内容需HTML转义
3. **CSRF Protection**:
   - 后端提供 CSRF Token (如有需要)
   - SameSite Cookie 策略
4. **Token Security**:
   - LocalStorage 存储 Token (注意 XSS风险，需配合 CSP策略)
   - Token 设置合理过期时间 (2小时)
   - 敏感操作二次验证 (如删除、重置密码)
5. **Sensitive Data**:
   - ❌ **NO HARDCODED SECRETS** (Constitution Article III)
   - API Base URL 通过环境变量配置 (`import.meta.env.VITE_API_BASE_URL`)
   - 密钥、Token 不能提交到 Git

**❌ Out of Scope (Backend Responsibility)**:
- SQL Injection 防护 (Backend ORM处理)
- Rate Limiting (Backend API Gateway)
- HTTPS 证书配置 (运维层)

### 4.2 Environment Variables (.env files)

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

**Usage in code**:
```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

---

## 5. Database Interaction

**Frontend Role**: Vue管理后台 **不直接访问数据库**，所有数据操作通过 RESTful API 与 SpringBoot 后端交互。

**Data Persistence Layers**:
1. **Backend (RM-010)**: SpringBoot + MyBatis → MySQL
2. **Frontend (RM-004)**: Axios → Backend API → Get/Post JSON data
3. **Local Storage**: 仅存储 Token、用户偏好设置 (非业务数据)

**Mock Data Strategy** (RM-004阶段):
- 使用 `vite-plugin-mock` 拦截 API 请求
- Mock 数据结构必须与 Backend API 契约一致
- Mock 数据存放在 `src/mock/` 目录

**Example Mock**:
```typescript
// src/mock/auth.ts
import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/v1/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: {
            token: 'mock-jwt-token-xxxxx',
            user: {
              id: '1',
              username: 'admin',
              email: 'admin@example.com',
              roles: [{ id: '1', name: 'admin', permissions: [] }],
              avatar: '',
              status: 'active'
            },
            permissions: ['*:*:*'],  // Admin has all permissions
            expiresIn: 7200
          },
          message: '登录成功',
          timestamp: Date.now()
        }
      } else {
        return {
          code: 401,
          data: null,
          message: '用户名或密码错误',
          timestamp: Date.now()
        }
      }
    }
  }
] as MockMethod[]
```

---

## 6. Reusable Components & Utilities

### 6.1 Layout Components

**Core Layout** (`src/layout/index.vue`):
- Sidebar (可折叠侧边栏)
- Navbar (顶部导航栏)
- AppMain (主内容区)
- TagsView (标签页导航，可选)

**Features**:
- 响应式布局 (≥1024px 展开侧边栏, <1024px 折叠)
- 侧边栏折叠动画 (200px ↔ 64px)
- 路由高亮显示
- 面包屑自动生成

### 6.2 Common Components

**已识别的可复用组件**:
1. **SvgIcon** - SVG 图标组件 (使用 vite-plugin-svg-icons)
2. **Pagination** - 分页组件 (封装 el-pagination)
3. **RightPanel** - 右侧设置面板 (可选)
4. **Breadcrumb** - 面包屑导航
5. **Hamburger** - 汉堡菜单按钮 (侧边栏折叠触发器)
6. **ThemePicker** - 主题切换器 (可选)

### 6.3 Utility Functions

**已识别的工具函数**:

```typescript
// src/utils/validate.ts - 表单校验
export const isValidUsername = (str: string) => /^[a-zA-Z0-9_]{4,16}$/.test(str)
export const isValidEmail = (str: string) => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
export const isValidPassword = (str: string) => str.length >= 6 && str.length <= 20

// src/utils/permission.ts - 权限判断
export const checkPermission = (value: string[]) => {
  const userStore = useUserStore()
  return value.some(permission => userStore.permissions.includes(permission))
}

// src/utils/storage.ts - LocalStorage 封装
export const storage = {
  get(key: string) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    localStorage.removeItem(key)
  }
}

// src/utils/crypto.ts - 密码加密
import CryptoJS from 'crypto-js'
export const encryptPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString()
}
```

---

## 7. Testing Strategy

### 7.1 Test Pyramid

```
        E2E Tests (5%)           ← Playwright (RM-004不实现，RM-011后考虑)
       ／           \
      ／             \
   Integration (15%)  ← Vitest (组件集成测试)
   ／                 \
  ／                   \
Unit Tests (80%)        ← Vitest (工具函数、Store、Hook测试)
```

### 7.2 Unit Testing (Vitest)

**Test Coverage Target**: ≥80% (Constitution Article I.1)

**Critical Test Areas**:
1. **Stores (Pinia)**:
   - `userStore`: login, logout, getUserInfo actions
   - `permissionStore`: generateRoutes logic
   - `appStore`: sidebar toggle, device detection

2. **Utils**:
   - `validate.ts`: All validation functions
   - `permission.ts`: checkPermission logic
   - `storage.ts`: get/set/remove operations

3. **API Services**:
   - Mock Axios responses
   - Test error handling

**Example Test** (src/stores/__tests__/user.spec.ts):
```typescript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

vi.mock('@/api/auth')

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should login successfully', async () => {
    const store = useUserStore()
    const mockResponse = {
      token: 'test-token',
      user: { id: '1', username: 'admin', roles: [{ name: 'admin' }] }
    }

    vi.mocked(authApi.login).mockResolvedValue(mockResponse)

    await store.login({ username: 'admin', password: '123456' })

    expect(store.token).toBe('test-token')
    expect(store.userInfo).toEqual(mockResponse.user)
  })

  it('should logout successfully', () => {
    const store = useUserStore()
    store.token = 'test-token'
    store.userInfo = { id: '1', username: 'admin' }

    store.logout()

    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
  })
})
```

### 7.3 Component Testing (Vitest + Vue Test Utils)

**Test Strategy**:
- **Layout Components**: 测试侧边栏折叠、路由高亮
- **Form Components**: 测试表单校验、提交逻辑
- **Table Components**: 测试分页、排序、筛选

**Example Test** (src/layout/__tests__/Sidebar.spec.ts):
```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Sidebar from '@/layout/components/Sidebar.vue'

describe('Sidebar', () => {
  it('should toggle sidebar open/close', async () => {
    const wrapper = mount(Sidebar, {
      props: { isCollapse: false }
    })

    expect(wrapper.classes()).not.toContain('is-collapse')

    await wrapper.setProps({ isCollapse: true })

    expect(wrapper.classes()).toContain('is-collapse')
  })
})
```

### 7.4 TDD Workflow (Constitution Article IV)

**Mandatory Sequence**:
1. ✅ **Write Test First** (Test Task in TASKS.md)
2. ✅ **Run Test → Verify Failure** (TEST VERIFICATION CHECKPOINT)
3. ✅ **Implement Code** (Implementation Task in TASKS.md)
4. ✅ **Run Test → Verify Pass**
5. ✅ **Refactor (if needed)**

**Example TASKS.md Structure**:
```markdown
## User Story 1: 项目初始化与基础配置

### TEST TASKS
- [ ] T001: Write unit tests for environment variable loading
- [ ] T002: Write integration tests for Vite dev server startup

### TEST VERIFICATION CHECKPOINT
→ ALL tests above MUST fail before proceeding

### IMPLEMENTATION TASKS
- [ ] T003: Create Vite project with Vue 3 + TypeScript template
- [ ] T004: Configure .env files for development and production
```

---

## 8. Build & Deployment

### 8.1 Vite Build Configuration

**Build Output**:
```
dist/
├── assets/
│   ├── index-[hash].js     # Main JS bundle (gzipped < 500KB)
│   ├── vendor-[hash].js    # Third-party libs (Element Plus, Vue, etc.)
│   └── index-[hash].css    # Styles bundle
├── index.html              # Entry HTML
└── favicon.ico
```

**Build Optimizations**:
- **Code Splitting**: Dynamic imports for route components
- **Tree Shaking**: Remove unused Element Plus components
- **Minification**: Terser for JS, cssnano for CSS
- **Asset Compression**: gzip/brotli enabled

**vite.config.ts**:
```typescript
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] })
  ],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    },
    chunkSizeWarningLimit: 1000  // 警告阈值 1MB
  }
})
```

### 8.2 CI/CD Pipeline (Out of Scope for RM-004)

RM-004 仅负责本地开发环境搭建，CI/CD 由 RM-011 或后续需求负责。

**Minimal Scripts in package.json**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "type-check": "vue-tsc --noEmit"
  }
}
```

---

## 9. Performance Considerations

### 9.1 Performance Targets (from PRD NFR)

- **Initial Load**: < 2s (3G network)
- **Bundle Size**: < 2.5MB (gzipped)
- **TTI (Time to Interactive)**: < 3s
- **Lighthouse Score**: ≥ 90 (Performance)

### 9.2 Optimization Strategies

**Code-Level**:
1. **Route Lazy Loading**:
   ```typescript
   {
     path: '/dashboard',
     component: () => import('@/views/dashboard/index.vue')
   }
   ```
2. **Component Lazy Loading**:
   ```typescript
   const HeavyChart = defineAsyncComponent(() => import('@/components/HeavyChart.vue'))
   ```
3. **Virtual Scrolling**: For long lists (use `el-virtual-list` or `vue-virtual-scroller`)

**Network-Level**:
1. **API Response Caching**: Axios cache plugin (短期缓存字典数据)
2. **Image Optimization**: WebP format, lazy loading (`<img loading="lazy">`)
3. **CDN**: Static assets (考虑在生产环境使用CDN，RM-004阶段不实现)

**Build-Level**:
1. **Code Splitting**: Vendor chunk separation
2. **Tree Shaking**: Remove unused code
3. **Minification**: JS/CSS压缩
4. **Compression**: Gzip/Brotli enabled on server

---

## 10. Dependencies & Version Locking

### 10.1 Core Dependencies (from Research R001-R010)

```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.5.0",
    "pinia": "^2.3.0",
    "element-plus": "^2.9.0",
    "@element-plus/icons-vue": "^2.3.0",
    "axios": "^1.7.0",
    "crypto-js": "^4.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "vue-tsc": "^2.0.0",
    "vitest": "^2.0.0",
    "@vue/test-utils": "^2.4.0",
    "vite-plugin-mock": "^3.0.0",
    "mockjs": "^1.1.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "unplugin-auto-import": "^0.18.0",
    "unplugin-vue-components": "^0.27.0"
  }
}
```

### 10.2 Version Lock Strategy

- **Caret (^)**: 允许小版本和补丁更新 (如 ^3.5.0 → 3.6.x ✅, 4.0.0 ❌)
- **Tilde (~)**: 仅允许补丁更新 (如 ~3.5.0 → 3.5.x ✅, 3.6.0 ❌)
- **Exact**: 锁定确切版本 (不推荐，除非有兼容性问题)

**Lock File**: `pnpm-lock.yaml` or `package-lock.json` 必须提交到 Git (保证团队依赖一致性)

---

## 11. Code Examples & Reference Patterns

### 11.1 Recommended Project Structure

```
vue-admin/
├── public/                       # 静态资源
│   └── favicon.ico
├── src/
│   ├── api/                      # API服务层
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── types.ts
│   ├── assets/                   # 资源文件
│   │   ├── icons/                # SVG图标
│   │   └── styles/               # 全局样式
│   ├── components/               # 通用组件
│   │   ├── SvgIcon/
│   │   ├── Pagination/
│   │   └── Breadcrumb/
│   ├── directives/               # 自定义指令
│   │   └── permission.ts
│   ├── layout/                   # 布局组件
│   │   ├── index.vue
│   │   ├── components/
│   │   │   ├── Sidebar.vue
│   │   │   ├── Navbar.vue
│   │   │   └── AppMain.vue
│   ├── mock/                     # Mock数据
│   │   ├── auth.ts
│   │   └── user.ts
│   ├── router/                   # 路由配置
│   │   ├── index.ts              # 路由实例
│   │   ├── routes.ts             # 路由表
│   │   └── permission.ts         # 路由守卫
│   ├── stores/                   # Pinia Store
│   │   ├── user.ts
│   │   ├── app.ts
│   │   └── permission.ts
│   ├── utils/                    # 工具函数
│   │   ├── request.ts            # Axios封装
│   │   ├── validate.ts           # 校验函数
│   │   ├── permission.ts         # 权限判断
│   │   ├── storage.ts            # LocalStorage封装
│   │   └── crypto.ts             # 加密工具
│   ├── views/                    # 页面组件
│   │   ├── login/
│   │   │   └── index.vue
│   │   ├── dashboard/
│   │   │   └── index.vue
│   │   └── error/
│   │       ├── 403.vue
│   │       └── 404.vue
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 入口文件
│   └── env.d.ts                  # 环境变量类型
├── tests/                        # 测试文件
│   ├── unit/
│   └── integration/
├── .env.development              # 开发环境变量
├── .env.production               # 生产环境变量
├── .eslintrc.cjs                 # ESLint配置
├── .prettierrc.json              # Prettier配置
├── tsconfig.json                 # TypeScript配置
├── vite.config.ts                # Vite配置
├── package.json                  # 依赖清单
└── README.md                     # 项目文档
```

### 11.2 Reference Projects (from Research R010)

**Primary Reference**: [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin)
- ✅ Tech Stack 100% Match (Vue 3 + Vite + TypeScript + Element Plus + Pinia)
- ✅ RBAC Permission System
- ✅ Mock Data Integration
- ✅ Well-documented

**Secondary References**:
- [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) - Performance optimization patterns
- [vue-manage-system](https://github.com/lin-xin/vue-manage-system) - Simplicity patterns

---

## 12. Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Element Plus 版本更新导致Breaking Changes | H | L | 锁定版本 ^2.9.0，关注官方更新日志，测试环境先升级验证 |
| Mock 数据与 Backend API 不一致 | H | M | RM-010阶段先定义 OpenAPI 规范，Mock严格遵守契约，联调前执行契约测试 |
| TypeScript any 类型泛滥 | M | M | ESLint 规则强制禁止 any (`@typescript-eslint/no-explicit-any: error`) |
| 测试覆盖率不达标 (<80%) | H | M | CI 集成 Vitest coverage check，低于80%阻止合并 (RM-011实现) |
| 权限系统过度设计 | M | L | 遵循 Constitution Article VII (Simplicity Gate)，仅实现 RBAC，避免 ABAC |
| 前端直接暴露敏感信息 | H | L | Code Review检查硬编码密钥，环境变量存储所有敏感配置 |

---

## 13. Constitution Compliance Checklist

**Article I: Quality First**
- ✅ Test Coverage ≥80% (Vitest + Vue Test Utils)
- ✅ No Partial Implementation (Complete or defer to future requirements)
- ✅ No TODOs in production code

**Article III: Security Standards**
- ✅ No Hardcoded Secrets (use .env files)
- ✅ Password encryption before transmission
- ✅ XSS prevention (Vue template escaping)

**Article IV: Test-First Development (TDD)**
- ✅ Tests written BEFORE implementation (enforced in TASKS.md)
- ✅ TEST VERIFICATION CHECKPOINT mandatory

**Article VI: Anti-Abstraction**
- ✅ Use Vue Router directly (no custom router wrapper)
- ✅ Use Element Plus directly (no BaseComponent abstraction)
- ✅ Use Axios directly (minimal request wrapper)

**Article VII: Simplicity Gate**
- ✅ Maximum 3 layers: View → Store → API Service
- ✅ RBAC (not ABAC) for permission system
- ✅ No future-proofing abstractions

**Article X: Requirement Boundary**
- ✅ Implement ONLY what PRD specifies (9 user stories)
- ✅ No speculative features (暗色模式、国际化、移动端适配 out of scope)

---

## 14. Next Steps & Handoff

### For TECH_DESIGN.md Generation (Next Stage):
1. Use this analysis as foundation
2. Elaborate on system architecture diagrams
3. Define API contracts in detail (OpenAPI spec)
4. Specify test plan with TDD workflow

### For EPIC & TASKS Planning:
1. Break down PRD user stories into atomic tasks
2. Ensure TDD sequence: Test → Verify Fail → Implement → Verify Pass
3. Reference this document for technical constraints

### For Implementation (RM-004):
1. Follow recommended project structure (Section 11.1)
2. Reference vue3-element-admin patterns (Section 11.2)
3. Maintain ≥80% test coverage (Section 7)
4. Comply with Constitution (Section 13)

---

**Generated By**: Claude Code (CC-DevFlow)
**Document Version**: 1.0.0
**Last Updated**: 2025-11-21T17:00:00+08:00
