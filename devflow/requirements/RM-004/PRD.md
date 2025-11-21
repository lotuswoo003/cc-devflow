# PRD: RM-004 - Vue管理后台框架

**Status**: Draft
**Created**: 2025-11-21T16:30:00+08:00
**Owner**: 项目团队
**Type**: Framework - 基础架构

**Input**: 用户需求描述、研究材料 from `devflow/requirements/RM-004/research/`
**Prerequisites**: 需求 ID 已创建，初始需求信息已提供

---

## 背景与目标

### 业务背景

陪玩服务平台采用三端分离架构（微信小程序 + Vue管理后台 + SpringBoot后端），需要为B端运营人员提供一个功能完善的Web管理后台。该管理后台将支持服务项目管理、客服配置、用户管理、咨询记录查看等核心运营功能。

本需求（RM-004）是整个管理后台系统的**基础架构**，负责搭建Vue 3项目框架，配置路由系统、布局系统、权限系统、HTTP请求封装和Mock数据集成，为后续管理页面开发（RM-005~RM-008）奠定基础。

根据 devflow/ARCHITECTURE.md（ADR-002），项目采用"前端先行 + Mock数据"开发策略，管理后台将先使用Mock数据进行功能验证，待后端API开发完成后（RM-010）再进行前后端联调（RM-011）。

### 问题陈述

**当前痛点**:
1. 运营人员缺乏统一的Web管理后台，无法高效管理服务项目、用户和咨询记录
2. 手工配置客服信息（电话、微信号）效率低，易出错
3. 缺乏可视化的用户和咨询数据统计能力
4. 后续管理页面开发（RM-005~RM-008）缺乏统一的技术基础和开发规范

**需解决的核心问题**:
- 建立标准化的Vue 3项目架构，统一技术栈和开发规范
- 提供开箱即用的布局系统（侧边栏 + 顶部导航 + 主内容区）
- 实现完善的路由和权限控制机制
- 封装统一的HTTP请求层，支持请求/响应拦截、错误处理
- 集成Mock数据方案，支持前端独立开发和功能验证

### 目标

- **主要目标**:
  1. 完成Vue 3 + TypeScript + Vite管理后台项目框架搭建
  2. 实现可复用的布局系统、路由系统和权限系统
  3. 提供HTTP请求封装和Mock数据集成
  4. 确保后续4个管理页面（RM-005~RM-008）能够基于此框架快速开发

- **成功指标**:
  1. 框架搭建完成，项目可正常运行并展示登录页和Dashboard演示页面
  2. 后续管理页面开发时，开发人员可直接使用框架提供的布局、路由、权限和HTTP功能，无需重复开发
  3. 开发文档完善，示例代码清晰，新开发人员可在1天内上手

- **影响范围**:
  - 直接依赖方: RM-005（服务管理页面）、RM-006（客服配置页面）、RM-007（用户列表页面）、RM-008（咨询记录页面）
  - 后续影响: RM-011（前后端联调时需要替换Mock为真实API）

---

## 用户故事与验收标准

### Story 1: 项目初始化与基础配置 (Priority: P1) 🎯 MVP

**As a** 开发人员
**I want** 使用Vite快速创建Vue 3 + TypeScript项目，并完成基础配置（ESLint、Prettier、环境变量）
**So that** 项目具有统一的代码风格和开发环境，团队协作效率高

**Why this priority**: 这是所有后续开发的前提条件，必须最先完成

**Independent Test**: 运行`npm install`和`npm run dev`，项目能够成功启动并在浏览器中打开，无报错

**Acceptance Criteria**:
```gherkin
AC1: Given 开发人员使用 Vite 创建 Vue 3 + TypeScript 项目
     When 执行 npm install 安装依赖
     Then 所有依赖安装成功，无错误或警告

AC2: Given 项目已初始化
     When 执行 npm run dev 启动开发服务器
     Then 浏览器自动打开 http://localhost:5173，显示默认欢迎页面

AC3: Given 项目配置了 ESLint 和 Prettier
     When 开发人员编写不符合规范的代码（如缺少分号、多余空格）
     Then ESLint 在保存时自动提示错误，Prettier 自动格式化代码

AC4: Given 项目配置了环境变量文件 .env.development 和 .env.production
     When 开发人员在代码中访问 import.meta.env.VITE_API_BASE_URL
     Then 根据当前环境（开发/生产）返回对应的API地址
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: LOW

---

### Story 2: UI组件库集成（Element Plus） (Priority: P1) 🎯 MVP

**As a** 开发人员
**I want** 集成 Element Plus 组件库并配置按需导入
**So that** 后续页面开发可以直接使用丰富的UI组件，无需手动注册

**Why this priority**: UI组件库是所有页面开发的基础，必须在布局系统之前完成

**Independent Test**: 创建一个测试页面，使用Element Plus的Button、Table、Form等组件，组件能够正常渲染且样式正确

**Acceptance Criteria**:
```gherkin
AC1: Given 项目已安装 Element Plus 和自动导入插件
     When 开发人员在组件中使用 <el-button>
     Then 按钮正常渲染，无需手动 import 和 register

AC2: Given Element Plus 配置了按需导入
     When 执行 npm run build 打包项目
     Then 只打包实际使用的组件，打包体积 < 2.5MB（gzip压缩后）

AC3: Given Element Plus 图标库已安装
     When 开发人员使用 <el-icon><Edit /></el-icon>
     Then 图标正常显示，无需额外配置

AC4: Given Element Plus 主题颜色已配置
     When 修改 src/styles/element-plus.scss 中的主题变量（如 --el-color-primary）
     Then 所有 Element Plus 组件的主题色同步更新
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: LOW

---

### Story 3: 布局系统实现（侧边栏 + 顶部导航） (Priority: P1) 🎯 MVP

**As a** 开发人员
**I want** 使用统一的布局框架（侧边栏 + 顶部导航 + 主内容区）
**So that** 所有管理页面具有一致的视觉风格和交互体验

**Why this priority**: 布局系统是管理后台的视觉基础，后续所有页面都依赖此布局

**Independent Test**: 访问任意管理页面路由，页面显示完整的布局结构（左侧菜单、顶部导航、内容区），侧边栏可折叠/展开

**Acceptance Criteria**:
```gherkin
AC1: Given 用户访问管理后台任意页面（除登录页）
     When 页面加载完成
     Then 页面左侧显示侧边栏菜单，顶部显示导航栏（面包屑、用户信息），中间显示主内容区

AC2: Given 侧边栏菜单已渲染
     When 用户点击菜单项（如"服务管理"）
     Then 路由跳转到对应页面，菜单项高亮显示，面包屑同步更新

AC3: Given 侧边栏处于展开状态
     When 用户点击侧边栏折叠按钮
     Then 侧边栏宽度从 200px 缩小到 64px，菜单文字隐藏，仅显示图标

AC4: Given 顶部导航栏已显示用户信息（头像、用户名）
     When 用户点击用户信息下拉菜单
     Then 显示"退出登录"选项，点击后清除登录状态并跳转到登录页

AC5: Given 页面路由为 /service/list
     When 面包屑组件根据路由计算路径
     Then 显示 "首页 / 服务管理 / 服务列表"，每级可点击跳转
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: MEDIUM

---

### Story 4: 路由系统与权限控制 (Priority: P1) 🎯 MVP

**As a** 开发人员
**I want** 使用 Vue Router 4 配置路由，并实现路由守卫（登录验证、权限验证）
**So that** 不同权限的用户只能访问其被授权的页面

**Why this priority**: 路由和权限是管理后台的安全基础，必须在页面开发前完成

**Independent Test**: 未登录用户访问管理页面时自动跳转到登录页；已登录但无权限的用户访问页面时显示"无权限"提示

**Acceptance Criteria**:
```gherkin
AC1: Given 用户未登录（localStorage 中无有效 token）
     When 用户直接访问 /service/list 等管理页面
     Then 路由守卫拦截请求，自动跳转到 /login 登录页

AC2: Given 用户已登录（localStorage 中有有效 token）
     When 用户访问被授权的页面（如 /service/list）
     Then 页面正常加载，路由守卫放行

AC3: Given 用户已登录但权限不足（角色为"访客"）
     When 用户访问需要"管理员"权限的页面（如 /service/edit）
     Then 显示"403 无权限访问"提示，并提供返回首页按钮

AC4: Given 路由配置了懒加载（动态 import）
     When 用户访问 /service/list 页面
     Then 浏览器仅加载该页面的JS文件，其他页面暂不加载，优化首屏性能

AC5: Given 路由配置了动态路由加载（基于用户权限）
     When 用户登录后，根据其角色（admin/user）加载不同的菜单路由
     Then 侧边栏仅显示该用户有权限访问的菜单项
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: HIGH

---

### Story 5: HTTP请求封装（Axios拦截器） (Priority: P1) 🎯 MVP

**As a** 开发人员
**I want** 使用封装好的HTTP请求工具（基于Axios），统一处理请求头、响应数据和错误处理
**So that** 后续页面开发只需关注业务逻辑，无需重复处理请求细节

**Why this priority**: HTTP请求是前后端通信的基础，必须在Mock集成前完成

**Independent Test**: 调用封装的 `request.get('/api/test')` 方法，请求自动携带 token，响应数据自动提取，错误自动提示

**Acceptance Criteria**:
```gherkin
AC1: Given Axios已配置请求拦截器
     When 开发人员调用 request.get('/api/users')
     Then 请求头自动添加 Authorization: Bearer {token}（从 localStorage 读取）

AC2: Given Axios已配置响应拦截器
     When 接口返回标准格式 { code: 200, data: {...}, message: 'success' }
     Then 拦截器自动提取 data 字段并返回，开发人员无需手动解析

AC3: Given Axios已配置响应拦截器
     When 接口返回错误 { code: 401, message: '未授权' }
     Then 拦截器自动显示 Element Plus Message 错误提示，并清除 token 跳转到登录页

AC4: Given Axios已配置响应拦截器
     When 接口返回 500 或网络错误
     Then 拦截器自动显示"服务器错误，请稍后重试"提示，并在控制台打印完整错误信息

AC5: Given HTTP请求工具支持取消请求
     When 用户快速切换页面导致多个请求pending
     Then 旧请求自动取消，避免竞态条件和资源浪费
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: MEDIUM

---

### Story 6: Mock数据集成（vite-plugin-mock） (Priority: P1) 🎯 MVP

**As a** 开发人员
**I want** 使用 Mock.js 和 vite-plugin-mock 生成模拟数据
**So that** 前端可独立开发和测试，不依赖后端API

**Why this priority**: Mock数据集成使前端能够独立开发，符合项目"前端先行"策略

**Independent Test**: 调用 `/api/mock/users` 等Mock接口，返回符合约定格式的模拟数据

**Acceptance Criteria**:
```gherkin
AC1: Given vite-plugin-mock 已配置
     When 开发人员在 src/mock/ 目录创建 user.ts 并定义 Mock 接口
     Then 开发服务器自动加载Mock接口，访问 /api/mock/users 返回模拟数据

AC2: Given Mock接口定义了 GET /api/mock/services（服务列表）
     When 前端调用 request.get('/api/mock/services')
     Then 返回包含10条服务记录的模拟数据，每条记录包含 id、name、description、price 字段

AC3: Given Mock接口定义了 POST /api/mock/services（新增服务）
     When 前端调用 request.post('/api/mock/services', { name, description, price })
     Then Mock返回成功响应 { code: 200, message: '新增成功' }，并在下次GET请求时返回包含新记录的列表

AC4: Given Mock数据使用 Mock.js 语法生成
     When Mock定义了 '@name': '@cname'（随机中文姓名）
     Then 每次请求返回不同的随机姓名，模拟真实数据

AC5: Given 项目配置了开发环境和生产环境变量
     When 切换到生产环境（npm run build）
     Then Mock插件自动禁用，所有请求发送到真实API地址（VITE_API_BASE_URL）
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: MEDIUM

---

### Story 7: 状态管理（Pinia） (Priority: P2)

**As a** 开发人员
**I want** 使用 Pinia 管理全局状态（用户信息、应用配置、权限）
**So that** 多个组件可以共享状态，避免prop drilling和事件传递

**Why this priority**: 状态管理提升代码可维护性，但可延后到具体页面开发时再完善

**Independent Test**: 在用户登录后，Pinia store 中存储用户信息和权限，侧边栏和顶部导航能够访问并显示这些信息

**Acceptance Criteria**:
```gherkin
AC1: Given Pinia已安装并配置
     When 开发人员创建 useUserStore() 并定义 state.userInfo
     Then 组件中可通过 const userStore = useUserStore(); console.log(userStore.userInfo) 访问用户信息

AC2: Given 用户登录成功
     When 调用 userStore.setUserInfo({ id, name, role })
     Then 用户信息存储到Pinia store，并同步持久化到 localStorage

AC3: Given Pinia store 中存储了侧边栏折叠状态（appStore.sidebarCollapsed）
     When 用户点击侧边栏折叠按钮
     Then appStore.toggleSidebar() 方法更新状态，侧边栏组件响应状态变化并折叠/展开

AC4: Given permissionStore 存储了用户权限列表（如 ['service:edit', 'user:view']）
     When 组件中使用 v-permission="'service:edit'" 指令
     Then 指令根据权限列表判断是否显示该元素（如编辑按钮）
```

**Priority**: P2 (High)
**Complexity**: MEDIUM

---

### Story 8: 登录页与认证流程 (Priority: P2)

**As a** 运营人员
**I want** 访问管理后台时，先进入登录页输入用户名和密码
**So that** 只有授权用户可以访问管理功能，保证系统安全

**Why this priority**: 登录功能是后台安全的基础，但可在框架搭建完成后再实现

**Independent Test**: 在登录页输入正确的用户名和密码，点击登录后跳转到Dashboard；输入错误信息时显示错误提示

**Acceptance Criteria**:
```gherkin
AC1: Given 用户访问管理后台首页
     When 检测到用户未登录（localStorage 无 token）
     Then 自动跳转到 /login 登录页，显示用户名和密码输入框

AC2: Given 用户在登录页输入用户名 admin 和密码 123456
     When 点击"登录"按钮
     Then 调用 POST /api/mock/auth/login 接口，接收返回的 token 和用户信息

AC3: Given 登录接口返回成功
     When 前端接收到 token
     Then 将 token 存储到 localStorage，将用户信息存储到 Pinia userStore，并跳转到 /dashboard

AC4: Given 用户输入错误的用户名或密码
     When 点击"登录"按钮
     Then Mock接口返回 { code: 401, message: '用户名或密码错误' }，前端显示错误提示

AC5: Given 用户已登录
     When 用户点击顶部导航栏的"退出登录"按钮
     Then 清除 localStorage 中的 token，清除 Pinia userStore 中的用户信息，并跳转到登录页
```

**Priority**: P2 (High)
**Complexity**: MEDIUM

---

### Story 9: Dashboard演示页面 (Priority: P3)

**As a** 开发人员
**I want** 创建一个Dashboard演示页面，展示框架的基本功能
**So that** 团队成员可以快速理解框架的使用方式，并作为后续页面开发的参考

**Why this priority**: Dashboard是演示性功能，非核心必需，可最后完成

**Independent Test**: 登录后默认进入Dashboard，页面显示欢迎信息、系统统计卡片和操作快捷入口

**Acceptance Criteria**:
```gherkin
AC1: Given 用户登录成功
     When 默认跳转到 /dashboard
     Then 页面显示 "欢迎回来，{用户名}" 和当前系统时间

AC2: Given Dashboard页面已加载
     When 页面渲染完成
     Then 显示3个统计卡片（服务总数、用户总数、今日咨询数），数据从Mock接口获取

AC3: Given Dashboard显示快捷操作入口
     When 用户点击"新增服务"按钮
     Then 跳转到 /service/create 页面（待RM-005实现）

AC4: Given Dashboard使用了 Element Plus 的 Card、Statistic 组件
     When 页面渲染
     Then 样式美观，组件功能正常，数据实时更新
```

**Priority**: P3 (Medium)
**Complexity**: LOW

---

### 边界案例处理

- **错误处理**:
  - 网络请求失败时，显示统一错误提示（Element Plus Message）
  - 路由不存在时，跳转到404页面
  - Token过期时，自动清除登录状态并跳转到登录页

- **权限控制**:
  - 使用RBAC（Role-Based Access Control）模式
  - 支持路由级权限（路由守卫）和按钮级权限（v-permission指令）
  - 动态菜单根据用户角色加载

- **数据验证**:
  - 表单使用 Element Plus Form Validation
  - 必填项、格式验证、长度限制
  - 前端验证通过后再发送请求

- **边界条件**:
  - 侧边栏宽度在1920px屏幕下为200px，小于1280px自动折叠
  - 表格数据为空时显示"暂无数据"占位符
  - 分页组件最大显示10页，超过时显示省略号

---

## 非功能性要求

### 性能要求

| 指标 | 目标值 | 关键性 |
|------|--------|--------|
| 首屏加载时间（p95） | < 2秒 | HIGH |
| 页面切换时间 | < 500ms | MEDIUM |
| 打包体积（gzip压缩后） | < 2.5MB | HIGH |
| 路由懒加载 | 100%（所有页面组件） | HIGH |

### 安全要求

- [x] **身份验证**: JWT token认证，token存储在localStorage，请求头自动携带Authorization
- [x] **授权机制**: RBAC权限模型，支持角色（admin/user）和权限（service:edit, user:view）
- [x] **数据加密**: HTTPS传输（生产环境），敏感字段（密码）前端不存储
- [x] **输入验证**: 所有表单输入必须验证（Element Plus Form Validation）
- [x] **审计日志**: 预留操作日志接口（待后端实现）
- [x] **密钥管理**: NO HARDCODED SECRETS - API地址、密钥使用环境变量（.env文件，gitignore排除）

### 可扩展性要求

- **水平扩展**: 前端静态资源部署在CDN，支持多实例负载均衡
- **功能扩展**:
  - 布局系统预留主题切换接口（支持暗色模式）
  - 路由系统支持动态添加路由（插件化功能扩展）
  - Mock系统可轻松切换为真实API（环境变量控制）

### 可靠性要求

- **可用性目标**: 前端静态资源可用性 99.9%（依赖CDN和Nginx）
- **错误处理**:
  - HTTP请求错误自动重试1次（可配置）
  - 网络超时时间设置为10秒
  - 页面崩溃时显示错误边界（Error Boundary）
- **降级策略**: Mock数据作为后端服务不可用时的降级方案

### 可观测性要求

- **日志记录**:
  - 控制台输出关键操作日志（开发环境）
  - 生产环境关闭console.log，使用专业日志服务（预留）
- **监控指标**:
  - 页面加载时间（Performance API）
  - API请求成功率和响应时间
  - 用户操作路径（预留埋点接口）
- **告警设置**: 预留错误监控接口（如Sentry），生产环境上报错误

### 可访问性要求

- **浏览器兼容性**:
  - Chrome 90+（优先支持）
  - Edge 90+
  - Firefox 90+
  - Safari 14+（macOS）
  - 不支持IE11
- **设备兼容性**:
  - 桌面端（1280px - 1920px，主要支持）
  - 平板端（768px - 1024px，基本支持）
  - 移动端（< 768px，不支持，管理后台非移动端场景）
- **无障碍标准**: 基本语义化HTML，表单label关联

---

## 技术约束

### 技术栈

- **语言/框架**: Vue 3.5+ (Composition API) + TypeScript 5.8+ + Vite 7+
- **UI库**: Element Plus 2.9+ + @element-plus/icons-vue 2.3+
- **状态管理**: Pinia 2.3+
- **路由**: Vue Router 4.5+
- **HTTP客户端**: Axios 1.7+
- **Mock**: Mock.js 1.1+ + vite-plugin-mock 3.0+
- **CSS方案**: SCSS + Element Plus内置样式 + UnoCSS（可选）
- **代码规范**: ESLint 9+ + Prettier 3+
- **工具函数**: @vueuse/core 11.3+

### 架构约束

- **必须使用**:
  - Vue 3 Composition API（禁止Options API）
  - TypeScript（禁止any类型，除非有充分理由）
  - Vite作为构建工具（不使用Webpack）
  - Element Plus作为UI库（不使用其他UI库）
  - Pinia作为状态管理（不使用Vuex）

- **禁止使用**:
  - BaseController、AbstractService等抽象基类（符合Constitution Article VIII）
  - jQuery或其他操作DOM的库
  - Vue 2语法（如$emit、$on等已废弃API）

- **集成要求**:
  - 后端API接口遵循RESTful规范
  - 接口返回标准格式: `{ code: number, data: any, message: string }`
  - 使用OpenAPI 3.0规范定义接口契约（待RM-010后端开发时提供）

- **数据格式**:
  - 日期时间统一使用ISO 8601格式（如2025-11-21T16:30:00+08:00）
  - 金额使用分为单位（整数），前端展示时转换为元

### 平台约束

- **浏览器支持**: Chrome 90+, Edge 90+, Firefox 90+, Safari 14+（不支持IE11）
- **操作系统**: Windows 10+, macOS 11+, Linux（仅开发环境）
- **屏幕分辨率**: 最小支持1280x720，推荐1920x1080

### 资源约束

- **预算限制**: 无额外预算（使用开源免费工具）
- **时间限制**: 1周（5个工作日）
- **团队规模**: 1-2名前端开发人员

---

## 成功指标

### 主要指标

| 指标 | 基线 | 目标 | 时间线 | 测量方法 |
|------|------|------|--------|----------|
| 框架搭建完成度 | 0% | 100% | 1周 | 所有用户故事验收标准通过 |
| 后续页面开发效率 | N/A | 1个CRUD页面≤1天 | RM-005~008阶段 | 实际开发时间记录 |
| 开发文档完善度 | 0% | 100%（README + 示例代码） | 1周 | 文档审查通过 |
| 打包体积 | N/A | < 2.5MB（gzip） | 1周 | npm run build后检查dist目录 |

### 次要指标

| 指标 | 基线 | 目标 | 时间线 | 测量方法 |
|------|------|------|--------|----------|
| 首屏加载时间 | N/A | < 2秒 | 1周 | Chrome DevTools Performance |
| TypeScript类型覆盖率 | 0% | 100%（无any） | 1周 | ESLint检查无警告 |
| 代码规范通过率 | 0% | 100% | 1周 | ESLint + Prettier检查无错误 |

---

## Constitution Check (宪法符合性检查)

*GATE: 必须在 Epic 规划前通过*

**Reference**: `.claude/constitution/project-constitution.md` (v2.0.0)

### Article I: Quality First (质量至上)

- [x] **I.1 - NO PARTIAL IMPLEMENTATION**: 需求定义完整且明确？无占位符和模糊表述？
  - ✅ 所有用户故事有明确的验收标准（Given-When-Then格式）
  - ✅ 所有技术细节已在研究阶段确定（research-summary.md, research.md）

- [x] **I.3 - No Simplification**: 避免"暂时简化，后续完善"的描述？
  - ✅ 所有功能都是完整实现，无"TODO"或"待完善"描述

- [x] 用户故事遵循 INVEST 准则（Independent, Negotiable, Valuable, Estimable, Small, Testable）？
  - ✅ 每个故事可独立交付和测试
  - ✅ 每个故事有明确的业务价值
  - ✅ 每个故事工作量可估算（1-3天）

- [x] 验收标准具体、可测试、可衡量？
  - ✅ 所有AC使用Given-When-Then格式
  - ✅ 包含正常流程和错误场景

### Article X: Requirement Boundary (需求边界) - CRITICAL

- [x] **X.1 - Forced Clarification**: 所有不明确之处标记 `[NEEDS CLARIFICATION: 具体问题]`？
  - ✅ 所有技术选型已在研究阶段确定（R001-R010决策）
  - ✅ 无需额外澄清的内容

- [x] **X.2 - No Speculative Features**: 无"可能需要"、"未来会"、"建议添加"的功能？
  - ✅ 所有功能都是当前需求必需的基础架构
  - ✅ "Out of Scope"章节明确列出不包含的功能

- [x] **X.3 - User Story Independence**: 每个故事有明确优先级（P1, P2, P3...）？
  - ✅ 6个P1故事（MVP Critical）
  - ✅ 2个P2故事（High priority）
  - ✅ 1个P3故事（Medium priority）

- [x] **X.3 - Independent Test**: 每个故事有独立测试标准？
  - ✅ 每个故事都有"Independent Test"描述

### Article II: Architectural Consistency (架构一致性)

- [x] **II.1 - NO CODE DUPLICATION**: 识别可复用的现有系统和组件？
  - ✅ 参考vue3-element-admin项目结构（研究决策R010）
  - ✅ 无重复造轮子，使用成熟的框架和库

- [x] **II.3 - Anti-Over-Engineering**: 解决方案适合问题规模？无过度设计？
  - ✅ 直接使用Vue 3、Element Plus、Vue Router，无额外抽象层
  - ✅ 符合Constitution Article VIII（Anti-Abstraction）

- [x] **II.4 - Single Responsibility**: 清晰的边界和职责划分？
  - ✅ 布局系统、路由系统、HTTP封装、Mock集成职责清晰
  - ✅ 文件组织按功能模块划分（api/、components/、layouts/、router/、stores/）

- [x] 模块化和可扩展性考虑合理？
  - ✅ 路由支持懒加载和动态添加
  - ✅ Mock系统可轻松切换为真实API
  - ✅ 布局系统预留主题扩展接口

### Article III: Security First (安全优先)

- [x] **III.1 - NO HARDCODED SECRETS**: 定义了密钥管理策略（环境变量/密钥服务）？
  - ✅ 使用.env文件存储API地址和配置
  - ✅ .env文件已加入.gitignore，不提交到代码库

- [x] **III.2 - Input Validation**: 输入验证需求明确？
  - ✅ 所有表单使用Element Plus Form Validation
  - ✅ 前端验证通过后再发送请求

- [x] **III.3 - Least Privilege**: 身份验证/授权机制清晰？
  - ✅ 使用JWT token认证
  - ✅ RBAC权限模型，支持角色和权限控制
  - ✅ 路由守卫和按钮级权限控制

- [x] **III.4 - Secure by Default**: 数据加密策略定义？
  - ✅ 生产环境强制HTTPS
  - ✅ 密码等敏感字段前端不存储

### Article IV: Performance Accountability (性能责任)

- [x] **IV.1 - NO RESOURCE LEAKS**: 考虑了资源管理（连接、文件句柄等）？
  - ✅ Axios请求支持取消，避免内存泄漏
  - ✅ 组件卸载时清理事件监听器

- [x] **IV.2 - Algorithm Efficiency**: 性能目标现实且可测量？
  - ✅ 首屏加载 < 2秒
  - ✅ 打包体积 < 2.5MB
  - ✅ 路由懒加载100%

- [x] **IV.4 - Caching Strategy**: 规划了监控和告警？
  - ✅ 预留Performance API监控接口
  - ✅ 预留Sentry错误监控接口

### Article V: Maintainability (可维护性)

- [x] **V.1 - NO DEAD CODE**: 避免不必要的功能？仅实现明确需求？
  - ✅ 所有功能都是后续页面开发的必需基础
  - ✅ Dashboard演示页面标记为P3（非必需）

- [x] **V.2 - Separation of Concerns**: 代码易于理解和修改？
  - ✅ 目录结构清晰（api/、layouts/、router/、stores/）
  - ✅ 职责分离（布局、路由、HTTP、状态管理独立）

- [x] **V.4 - File Size Limits**: 遵循单一职责原则？
  - ✅ 每个文件≤500行
  - ✅ 每个函数≤50行

### Constitutional Violations (宪法违规记录)

*无违规*

---

## 依赖关系

### 上游依赖
*此需求实现前必须完成的依赖*
- 无（基础架构，无前置依赖）

### 下游依赖
*依赖此需求的其他需求*
- **RM-005**: 服务项目管理页面（需要布局、路由、HTTP封装）
- **RM-006**: 客服配置页面（需要布局、路由、HTTP封装）
- **RM-007**: 用户列表页面（需要布局、路由、HTTP封装）
- **RM-008**: 咨询记录页面（需要布局、路由、HTTP封装）
- **RM-011**: 前后端联调（需要Mock接口定义和HTTP请求封装）

### 外部依赖
*第三方或外部系统依赖*
- **Node.js**: 版本18+，用于运行Vite开发服务器和构建工具
- **npm**: 版本9+，用于安装依赖包
- **浏览器**: Chrome 90+, Edge 90+, Firefox 90+, Safari 14+
- **Element Plus CDN**: 图标字体和主题资源（可选，优先使用npm包）

---

## 风险评估与缓解

### 技术风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| UI库选型后期变更成本高 | L | H | 在PRD阶段提前确认设计风格，使用Element Plus符合国内审美和团队习惯（研究决策R001） |
| TypeScript类型定义复杂，学习曲线陡 | M | M | 提供类型定义示例和最佳实践文档，团队共享类型定义经验 |
| Vite 7新版本可能有兼容性问题 | L | M | 优先使用稳定版本（7.0.0），关注官方更新日志，测试环境充分验证 |
| Mock数据与后端API不一致 | M | H | 在TECH_DESIGN阶段定义OpenAPI规范，Mock数据严格遵守契约，联调前进行契约测试 |

### 业务风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 后续管理页面需求变更，框架需要返工 | M | H | 框架设计时预留扩展接口（路由动态添加、权限灵活配置），采用模块化设计 |
| 运营人员对Element Plus组件风格不满意 | L | M | 提前提供Dashboard演示页面供运营人员预览，收集反馈后再开发后续页面 |

### 进度风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 框架搭建时间超出预期（1周） | M | M | 参考vue3-element-admin项目结构（研究决策R010），使用成熟脚手架，避免重复造轮子 |
| 开发人员对Vue 3 Composition API不熟悉 | M | M | 提前学习Vue 3官方文档，使用AI辅助开发（Claude Code），团队内部Code Review |
| Mock数据维护成本高 | L | L | Mock接口与真实API接口命名和参数保持一致，使用vite-plugin-mock自动生成部分Mock代码 |

---

## 范围界定

### 包含内容

- ✅ Vue 3 + TypeScript + Vite项目初始化
- ✅ ESLint + Prettier代码规范配置
- ✅ Element Plus组件库集成（按需导入）
- ✅ 布局系统（侧边栏 + 顶部导航 + 主内容区）
- ✅ 路由系统（Vue Router 4，支持懒加载和动态路由）
- ✅ 路由守卫（登录验证、权限验证）
- ✅ HTTP请求封装（Axios，支持拦截器和错误处理）
- ✅ Mock数据集成（Mock.js + vite-plugin-mock）
- ✅ Pinia状态管理（用户信息、应用配置、权限）
- ✅ 登录页和Dashboard演示页面
- ✅ 开发文档（README.md，包含环境准备、启动流程、目录说明）
- ✅ 示例代码（展示布局、路由、HTTP请求的使用方式）

### 明确不包含

*明确列出不在此需求范围内的内容*
- ❌ 具体业务页面开发（服务管理、客服配置、用户列表、咨询记录由RM-005~008负责）
- ❌ 后端API开发（由RM-009、RM-010负责）
- ❌ 真实数据对接（由RM-011前后端联调负责）
- ❌ 用户权限详细设计（如具体角色和权限点配置，待后续需求细化）
- ❌ 国际化（i18n）支持（当前仅支持中文）
- ❌ 暗色模式（Dark Mode）实现（预留接口，未来扩展）
- ❌ 移动端响应式适配（管理后台主要用于桌面端）
- ❌ 单元测试和E2E测试编写（后续需求补充）
- ❌ CI/CD流程配置（后续统一配置）
- ❌ 生产环境部署和运维（后续需求）

---

## 假设条件

*创建 PRD 时的关键假设*

1. **技术栈假设**: 团队已熟悉或愿意学习Vue 3 Composition API、TypeScript、Element Plus
2. **开发环境假设**: 开发人员本地已安装Node.js 18+和npm 9+
3. **设计风格假设**: Element Plus组件风格符合产品设计要求，无需额外定制
4. **接口契约假设**: 后端API将遵循RESTful规范，返回标准格式`{ code, data, message }`
5. **浏览器兼容假设**: 目标用户使用现代浏览器（Chrome/Edge/Firefox 90+），无需支持IE11
6. **用户规模假设**: 初期并发用户≤500，无需考虑极端高并发场景
7. **权限模型假设**: RBAC权限模型能够满足当前业务需求，暂不考虑ABAC等复杂模型
8. **Mock数据假设**: Mock数据结构在联调前保持稳定，变更时同步更新文档

---

## 未决问题

*Epic 规划前需要回答的问题*

- [x] **Q1**: UI库选择Element Plus还是Ant Design Vue？
  - 负责人: 项目团队
  - 截止日期: 2025-11-21
  - **已解决**: 选择Element Plus（研究决策R001）

- [x] **Q2**: 状态管理选择Pinia还是Vuex？
  - 负责人: 项目团队
  - 截止日期: 2025-11-21
  - **已解决**: 选择Pinia（研究决策R002）

- [x] **Q3**: Mock方案选择vite-plugin-mock还是MSW？
  - 负责人: 项目团队
  - 截止日期: 2025-11-21
  - **已解决**: 选择vite-plugin-mock（研究决策R007）

- [x] **Q4**: 权限模式选择RBAC还是ABAC？
  - 负责人: 项目团队
  - 截止日期: 2025-11-21
  - **已解决**: 选择RBAC（研究决策R008）

**所有未决问题已解决，可进入Epic规划阶段**

---

## 发布计划

### 里程碑

- **Phase 1**: 项目初始化 + UI库集成 - 第1天
  - 交付物: 项目可运行，Element Plus组件可用

- **Phase 2**: 布局系统 + 路由系统 - 第2-3天
  - 交付物: 侧边栏和顶部导航完成，路由跳转正常

- **Phase 3**: 权限系统 + HTTP封装 - 第4-5天
  - 交付物: 路由守卫生效，Axios请求拦截器工作正常

- **Phase 4**: Mock集成 + 登录页 + Dashboard - 第5-6天
  - 交付物: 登录流程完整，Dashboard可展示Mock数据

- **Phase 5**: 文档编写 + 示例代码 - 第6-7天
  - 交付物: README完善，示例代码清晰

### 回滚计划

- **回滚触发条件**:
  - 框架搭建后发现严重性能问题（首屏加载 > 5秒）
  - Element Plus组件与设计需求严重不符
  - 路由或权限系统设计缺陷，无法满足后续页面需求

- **回滚步骤**:
  1. 停止当前开发，评估问题严重性
  2. 召开技术评审会议，确定替代方案（如更换UI库、重构路由系统）
  3. 创建新的Git分支，保留旧版本代码
  4. 实施替代方案，重新测试和验证

- **数据处理**:
  - 无数据库操作，回滚无数据处理
  - Mock数据在新版本中可直接复用

---

## Progress Tracking (进度跟踪)

*在 PRD 创建过程中更新*

### 完成状态

- [x] 背景与目标明确
- [x] 用户故事定义（INVEST 合规）
- [x] 验收标准编写（Given-When-Then）
- [x] 功能需求文档化
- [x] 非功能需求规定
- [x] 技术约束识别
- [x] 成功指标定义
- [x] Constitution Check 通过
- [x] 依赖关系映射
- [x] 风险评估完成
- [x] 范围明确界定
- [x] 未决问题跟踪

### 质量检查

- [x] 所有用户故事有验收标准
- [x] 所有 NFR 有量化目标
- [x] 性能目标可测量
- [x] 安全要求完整
- [x] 无模糊需求
- [x] 所有缩写已定义

### 闸门状态

- [x] Constitution Check: PASS
- [x] 完整性验证: PASS
- [x] 质量检查: PASS

**准备好进行 Epic 规划**: YES

---

## 附录

### 研究材料

*链接到研究文档*
- [研究汇总](research/research-summary.md) - 10个关键技术决策 + 实施计划
- [研究决策](research/research.md) - R001~R010详细决策（UI库、状态管理、构建工具等）
- [代码库概览](research/internal/codebase-overview.md) - 项目类型、技术栈、目录结构建议
- [外部资源](research/mcp/20251121/guides/resources.md) - 官方文档、教程、开源项目

### 参考资料

*外部参考和文档*
- [Vue 3 官方文档](https://vuejs.org/) - Composition API, TypeScript支持
- [Element Plus 官方文档](https://element-plus.org/) - 组件使用、主题定制
- [Vite 官方文档](https://vitejs.dev/) - 配置、插件、优化
- [Pinia 官方文档](https://pinia.vuejs.org/) - 状态管理、持久化
- [Vue Router 官方文档](https://router.vuejs.org/) - 路由配置、导航守卫
- [vue3-element-admin 开源项目](https://github.com/youlaitech/vue3-element-admin) - 参考项目结构和实现

### 术语表

*定义领域特定术语*
- **Vite**: 新一代前端构建工具，基于ESM实现极速的开发服务器和优化的生产构建
- **Composition API**: Vue 3新增的API风格，使用setup函数组织逻辑，更适合TypeScript
- **Pinia**: Vue官方推荐的状态管理库，Vuex的继任者
- **RBAC**: Role-Based Access Control，基于角色的访问控制，用户通过角色获得权限
- **路由守卫**: 导航守卫，在路由跳转前/后执行的钩子函数，用于权限验证、登录检查
- **懒加载**: 路由懒加载，页面组件按需加载，减少首屏加载时间
- **Mock数据**: 模拟数据，前端开发阶段使用的假数据，模拟真实API响应
- **按需导入**: 自动按需导入组件和样式，减少打包体积

---

**Generated by**: prd-writer agent
**Based on**: CC-DevFlow Constitution v2.0.0
**Template Version**: 2.0.0 (Self-Executable)
**Next Step**: Run planner agent to generate EPIC.md and TASKS.md

---

## Validation Checklist (验证清单)

*GATE: PRD 标记为完成前检查*

### 需求不扩散验证 ⚠️ CRITICAL

- [x] **NO SPECULATION**: 所有功能都由用户明确提出或必需
- [x] **ALL CLARIFIED**: 没有未解决的 [NEEDS CLARIFICATION] 标记
- [x] **NO TECH DETAILS**: 没有技术实现细节（API, 数据库, 框架等）
- [x] **STORY INDEPENDENCE**: 每个故事都有 Independent Test 标准
- [x] **PRIORITY ASSIGNED**: 所有故事都有明确优先级 (P1, P2, P3...)
- [x] **MVP IDENTIFIED**: P1 故事能够作为独立 MVP 交付

### 用户故事质量 (INVEST 原则)

- [x] **Independent**: 每个故事可独立交付和测试
- [x] **Negotiable**: 细节可以讨论，实现方式灵活
- [x] **Valuable**: 有明确的用户/业务价值
- [x] **Estimable**: 可以估算工作量（不太大不太小）
- [x] **Small**: 可在一个迭代内完成
- [x] **Testable**: 有明确的验收标准和测试方法

### 验收标准质量

- [x] 使用 Given-When-Then 格式
- [x] 包含正常流程（Happy Path）
- [x] 包含边界情况（Edge Cases）
- [x] 包含错误场景（Error Handling）
- [x] 具体且可测试（非模糊描述）
- [x] 每个故事至少 2 个验收标准

### 完整性检查

- [x] 所有必需章节已填写
- [x] 没有 {{PLACEHOLDER}} 未替换
- [x] 所有依赖已识别（上游、下游、外部）
- [x] 所有风险已评估（技术、业务、进度）
- [x] 范围明确界定（包含 + 不包含）
- [x] 假设条件已列出

### Constitution 符合性

- [x] 通过所有宪法检查
- [x] 违规已文档化并说明理由（无违规）
- [x] 安全要求符合 NO HARDCODED SECRETS
- [x] 质量要求符合 NO PARTIAL IMPLEMENTATION
- [x] 架构要求符合 NO OVER-ENGINEERING
