# Codebase Overview for RM-004: Vue管理后台框架

**Generated**: 2025-11-21T16:00:00+08:00 北京时间
**Purpose**: 内部代码库调研，为Vue管理后台框架搭建提供基线信息

## Project Type

**Architecture**: Frontend-Backend Separation (前后端分离) + Multi-Client
- 三端分离架构：微信小程序（C端用户）、Vue管理后台（B端运营）、SpringBoot后端服务
- 前端先行开发策略：使用Mock数据快速验证产品价值
- 后端统一提供RESTful API服务

## Technology Stack

### Frontend (管理后台) - 本需求相关
- **Framework**: Vue 3
- **Language**: TypeScript
- **UI Library**: Element Plus / Ant Design Vue
- **State Management**: Vuex / Pinia
- **Router**: Vue Router
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Data Mocking**: Mock.js (开发阶段)

### Backend
- **Runtime**: Java 17
- **Framework**: SpringBoot 3.x
- **API Style**: RESTful API
- **ORM**: MyBatis / MyBatis-Plus
- **API Documentation**: Swagger / Knife4j

### Database
- **Primary**: MySQL 8.0
- **Connection Pool**: HikariCP (SpringBoot默认)

## Related Projects

### 已完成的需求
- **RM-001**: 小程序项目初始化 - 已完成框架搭建
  - 位置: 独立小程序项目（非本仓库）
  - 可参考的模式: 项目框架初始化流程

### 当前项目状态
- **Status**: 新项目，无现有Vue代码库
- **Directory Structure**: devflow/ 目录管理所有需求
- **Development Workflow**: CC-DevFlow (Claude Code Development Workflow)

## Key Modules

### 本需求需要创建的核心模块

1. **项目框架模块**
   - Vue 3 项目初始化
   - Vite 构建配置
   - TypeScript 配置
   - 目录结构设计

2. **路由模块**
   - Vue Router 配置
   - 路由守卫
   - 动态路由
   - 面包屑导航

3. **布局模块**
   - 后台布局框架
   - 侧边栏组件
   - 顶部导航栏
   - 主内容区

4. **权限模块**
   - 权限管理框架
   - 路由权限
   - 按钮权限
   - API权限

5. **UI组件库集成**
   - Element Plus / Ant Design Vue 集成
   - 全局样式配置
   - 主题配置

6. **HTTP请求模块**
   - Axios 封装
   - 请求拦截器
   - 响应拦截器
   - 错误处理

7. **Mock数据模块**
   - Mock.js 集成
   - Mock API 配置
   - 数据模拟

## Related Files and Services

### 需要参考的文档
- `devflow/ROADMAP.md`: 产品路线图，包含RM-004的定位和依赖
- `devflow/ARCHITECTURE.md`: 系统架构，包含技术栈和模块划分
- `devflow/requirements/RM-001/`: 小程序项目初始化，可参考框架搭建流程

### 需要创建的目录结构（建议）
```
admin/                      # Vue管理后台项目根目录（新建）
├── src/
│   ├── api/               # API接口定义
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── layouts/           # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── styles/            # 全局样式
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── public/                # 公共资源
├── index.html             # HTML模板
├── vite.config.ts         # Vite配置
├── tsconfig.json          # TypeScript配置
├── package.json           # 项目依赖
└── README.md              # 项目文档
```

## Existing Test Coverage

**Current Coverage**: 0% (新项目)

### 需要建立的测试模式
- **Unit Tests**: Vitest (Vue 3 推荐)
- **E2E Tests**: Cypress / Playwright (可选)
- **Component Tests**: @vue/test-utils

## Potential Extension Points

### 后续需求依赖本框架
1. **RM-005**: 服务项目管理页面
2. **RM-006**: 客服配置页面
3. **RM-007**: 用户列表页面
4. **RM-008**: 咨询记录页面
5. **RM-011**: 前后端联调

### 框架扩展点
- **布局系统**: 支持多种布局模式（侧边栏、顶部导航等）
- **主题系统**: 支持深色模式、自定义主题
- **国际化**: 多语言支持（可选）
- **权限系统**: 可扩展的权限模型

## Recommendations

### 技术选型建议
1. **UI库选择**: 推荐 **Element Plus**
   - Reason: Vue 3原生支持，生态成熟，文档完善
   - Alternative: Ant Design Vue (也是不错的选择)

2. **状态管理**: 推荐 **Pinia**
   - Reason: Vue 3官方推荐，轻量级，TypeScript支持好
   - Alternative: Vuex 4 (如果团队熟悉)

3. **Mock方案**: 推荐 **Mock.js + vite-plugin-mock**
   - Reason: 开发阶段快速验证，不依赖后端
   - Alternative: MSW (Mock Service Worker)

### 开发策略
- **阶段1**: 项目框架搭建 + 基础配置
- **阶段2**: 布局系统 + 路由系统
- **阶段3**: 权限系统框架
- **阶段4**: HTTP请求封装 + Mock集成
- **阶段5**: 文档编写 + 示例页面

### 需要关注的风险
1. **UI库选型**: Element Plus vs Ant Design Vue
   - Mitigation: 提前确认设计风格，避免中途更换
2. **权限系统设计**: 需要预留扩展性
   - Mitigation: 参考成熟的权限模型（RBAC）
3. **Mock数据维护**: Mock数据需要与后端API契约一致
   - Mitigation: 使用OpenAPI规范定义接口契约

## Summary

本需求 RM-004 是管理后台的**基础架构**，无现有代码库可复用，需要从零搭建。
核心任务是建立完整的Vue 3项目框架，包括路由、布局、权限系统，为后续管理页面开发（RM-005~RM-008）奠定基础。

**Next Steps**:
1. 确定UI库选型（Element Plus / Ant Design Vue）
2. 确定状态管理方案（Pinia / Vuex）
3. 设计目录结构
4. 搭建项目骨架
5. 编写开发文档
