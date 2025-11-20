# Tasks: RM-001 - 小程序项目初始化

**Input**: PRD.md, TECH_DESIGN.md, EPIC.md from `devflow/requirements/RM-001/`
**Prerequisites**: PRD.md (完成), TECH_DESIGN.md (完成), EPIC.md (完成)

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- **ID**: T001, T002, T003... (sequential numbering)
- Include exact file paths in task descriptions

---

## Phase 1: Setup (共享基础设施)

**Purpose**: 项目初始化和所有用户故事共用的基础结构

### 任务清单

- [ ] **T001** [P] Setup - 创建 miniapp/ 目录结构
  - 创建目录: `miniapp/pages/`, `miniapp/components/`, `miniapp/utils/`
  - 验证: 三个目录存在且为空

- [ ] **T002** [P] Setup - 安装微信开发者工具 ≥3.0.0（如未安装）
  - 参考: quickstart.md Section "Environment Setup"
  - 验证: 打开微信开发者工具，检查版本号

- [ ] **T003** [P] Setup - 初始化 Git 跟踪 miniapp/ 目录
  - 命令: `git add miniapp/` (如 miniapp/ 在 .gitignore 外)
  - 验证: `git status` 显示 miniapp/ 被跟踪

### Constitution Check (Phase 1)
- [x] **Article VII - Simplicity Gate**: 仅创建必需的3个目录（pages/, components/, utils/）
- [x] **Article VIII - Anti-Abstraction**: 无抽象层或模板
- [x] **Article II - Architectural Consistency**: 遵循微信小程序官方目录结构

---

## Phase 2: Tests First (TDD 测试优先) ⚠️

**Purpose**: 编写所有测试，确保它们失败，然后在 Phase 3 实现功能让它们通过

**⚠️ CRITICAL**: 所有测试必须在 Phase 3 之前完成并失败

### Contract Tests (基于 contracts/api-contract.json)

- [ ] **T004** [P] [US3] Test - 编写 GET /services Mock endpoint 的 contract test
  - 文件: `miniapp/utils/__tests__/mock.test.js`
  - 验证: Mock 数据返回符合 api-contract.json schema
  - 验证: 返回数组包含3个服务，每个服务有 id/name/description/price/imageUrl/category/status 字段
  - 验证: 每个字段类型正确（id: string, price: number, status: enum）
  - 参考: contracts/api-contract.json, data-model.md
  - **预期**: 测试失败（mock.js 未实现）

- [ ] **T005** [P] [US3] Test - 编写 request.js Mock 模式的 unit test
  - 文件: `miniapp/utils/__tests__/request.test.js`
  - 验证: `useMock: true` 时调用 mock.js
  - 验证: `useMock: false` 时调用 wx.request
  - 验证: 错误处理（网络异常、无效 endpoint）
  - 验证: 输入参数验证（URL 非空、options 为对象）
  - 参考: TECH_DESIGN.md Section 4.2
  - **预期**: 测试失败（request.js 未实现）

### Page Tests

- [ ] **T006** [P] [US2] Test - 编写 index 页面数据加载的 integration test
  - 文件: `miniapp/pages/index/__tests__/index.test.js`
  - 验证: 页面 onLoad 时调用 request.get('/services')
  - 验证: 页面正确渲染服务列表（setData 调用）
  - 验证: 页面处理 loading 和 error 状态
  - 参考: PRD.md Story 2 AC4
  - **预期**: 测试失败（index 页面未实现）

- [ ] **T007** [P] [US2] Test - 编写 customer 页面导航的 integration test
  - 文件: `miniapp/pages/customer/__tests__/customer.test.js`
  - 验证: 从 index 页面可以导航到 customer 页面
  - 验证: customer 页面显示客服信息
  - 参考: PRD.md Story 2 AC5
  - **预期**: 测试失败（customer 页面未实现）

### TEST VERIFICATION CHECKPOINT ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**ALL TESTS ABOVE MUST**:
1. Be written and committed to Git
2. Execute successfully (test framework runs)
3. **FAIL with clear error messages** (no implementation yet)
4. Cover the contracts defined in contracts/api-contract.json

**Verification Command** (from quickstart.md):
```bash
# Run tests (should all fail at this point)
npm test
# Expected: 0 passing, 4 failing
```

**DO NOT PROCEED TO PHASE 3 UNTIL ALL TESTS ARE FAILING**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## Phase 3: User Story 1 - 搭建小程序项目基础框架 (Priority: P1) 🎯 MVP

**Goal**: 建立可运行的小程序项目骨架

**Independent Test**: 在微信开发者工具中打开项目，能够正常编译和预览，显示默认首页内容，无报错或警告

### Implementation for User Story 1

- [ ] **T008** [P] [US1] Impl - 创建 app.js (应用入口逻辑)
  - 文件: `miniapp/app.js`
  - 内容:
    - App() 生命周期: onLaunch, onShow, onHide
    - globalData 初始化（空对象，未来存储全局数据）
    - 无 TODO 或占位符
  - 参考: TECH_DESIGN.md Section 1.2 "App Core", PRD.md Story 1 AC2
  - 验证: 文件完整，无语法错误

- [ ] **T009** [P] [US1] Impl - 创建 app.json (全局配置)
  - 文件: `miniapp/app.json`
  - 内容:
    - `pages` 数组: ["pages/index/index", "pages/customer/customer"]
    - `window` 配置: navigationBarTitleText, navigationBarBackgroundColor
    - 无 tabBar 配置（本需求不涉及）
  - 参考: TECH_DESIGN.md Section 1.2, PRD.md Story 1 AC4
  - 验证: JSON 格式正确，pages 数组包含2个页面

- [ ] **T010** [P] [US1] Impl - 创建 app.wxss (全局样式)
  - 文件: `miniapp/app.wxss`
  - 内容:
    - 基础 reset 样式（如 box-sizing, font-family）
    - 注释说明: "全局样式变量将在 Story 4 中添加"
    - 无硬编码颜色或字体（除非是通用 reset）
  - 参考: TECH_DESIGN.md Section 1.2, PRD.md Story 1 AC2
  - 验证: 文件存在，WXSS 语法正确

- [ ] **T011** [US1] Impl - 创建 project.config.json (项目配置)
  - 文件: `miniapp/project.config.json`
  - 内容:
    - `appid`: "touristappid" (测试 AppID) 或从环境变量读取
    - `projectname`: "companion-service-platform"
    - `compileType`: "miniprogram"
    - `setting`: 编译选项（ES6 转 ES5, 自动补全等）
  - 安全: **NO HARDCODED SECRETS** - appid 使用测试值或占位符
  - 参考: TECH_DESIGN.md Section 5.3, PRD.md Story 1 AC2
  - 验证: JSON 格式正确，appid 不是真实生产 AppID

**Checkpoint**: 此时项目可在微信开发者工具中打开，编译成功（虽然页面为空）

---

## Phase 4: User Story 2 - 创建页面四文件结构 (Priority: P1) 🎯 MVP

**Goal**: 为 RM-002 和 RM-003 准备页面基础结构

**Independent Test**: 在微信开发者工具的模拟器中，能够通过 wx.navigateTo 在 index 和 customer 页面之间跳转，两个页面分别显示占位内容

### Implementation for User Story 2

- [ ] **T012** [P] [US2] Impl - 创建 index 页面四文件结构
  - 文件: `miniapp/pages/index/index.js`
    - Page() 生命周期: onLoad, onShow
    - data: { services: [], loading: false }
    - 预留方法: loadServices() (空实现，注释"RM-002 实现")
  - 文件: `miniapp/pages/index/index.json`
    - `navigationBarTitleText`: "首页"
  - 文件: `miniapp/pages/index/index.wxml`
    - 占位内容: `<view class="container"><text>首页 - 服务列表（RM-002 实现）</text></view>`
  - 文件: `miniapp/pages/index/index.wxss`
    - 基础容器样式: `.container { padding: 20rpx; }`
  - 参考: TECH_DESIGN.md Section 1.2 "Pages Layer", PRD.md Story 2 AC1
  - 验证: 四个文件存在，页面可编译

- [ ] **T013** [P] [US2] Impl - 创建 customer 页面四文件结构
  - 文件: `miniapp/pages/customer/customer.js`
    - Page() 生命周期: onLoad, onShow
    - data: { customerService: { phone: '', wechat: '' } }
    - 预留方法: makePhoneCall() (空实现，注释"RM-003 实现")
  - 文件: `miniapp/pages/customer/customer.json`
    - `navigationBarTitleText`: "客服"
  - 文件: `miniapp/pages/customer/customer.wxml`
    - 占位内容: `<view class="container"><text>客服页面（RM-003 实现）</text></view>`
  - 文件: `miniapp/pages/customer/customer.wxss`
    - 基础容器样式: `.container { padding: 20rpx; }`
  - 参考: TECH_DESIGN.md Section 1.2 "Pages Layer", PRD.md Story 2 AC2
  - 验证: 四个文件存在，页面可编译

**Checkpoint**: 此时 index 和 customer 页面可独立显示占位内容

---

## Phase 5: User Story 3 - 封装网络请求和Mock数据工具 (Priority: P1) 🎯 MVP

**Goal**: 实现前端先行策略的核心工具

**Independent Test**: 在 index 页面中调用 request.js 的 GET 方法请求服务列表，返回 mock.js 中定义的Mock数据，数据结构符合预定义格式

### Implementation for User Story 3

- [ ] **T014** [P] [US3] Impl - 实现 utils/mock.js (Mock 数据)
  - 文件: `miniapp/utils/mock.js`
  - 内容:
    - 常量: MOCK_SERVICES (数组，3条服务记录)
    - 函数: getServices() - 返回 `{ code: 0, data: MOCK_SERVICES, message: "获取服务列表成功" }`
    - 函数: getServiceById(id) - 返回单条服务或 404 错误
    - 函数: simulateError() - 返回 `{ code: 500, data: null, message: "服务器内部错误" }`
    - module.exports: { getServices, getServiceById, simulateError }
  - 数据格式: 严格遵循 data-model.md（id, name, description, price, imageUrl, category, status）
  - 参考: TECH_DESIGN.md Section 3.1, data-model.md
  - **使测试通过**: T004 contract test
  - 验证: 返回数据符合 api-contract.json schema

- [ ] **T015** [US3] Impl - 实现 utils/request.js (网络请求封装)
  - 文件: `miniapp/utils/request.js`
  - 依赖: `miniapp/utils/config.js` (配置文件)
  - 内容:
    - 导入 mock.js 和 config.js
    - 函数: request.get(url, options) - Promise-based
      - 参数验证: url 非空，options 为对象
      - Mock 模式判断: `if (options.useMock || config.USE_MOCK)`
      - Mock 模式: 根据 url 调用 mock.js 对应函数
      - 真实 API 模式: 调用 wx.request()（预留，RM-011 实现）
      - 错误处理: try-catch 包装，统一错误格式
      - 日志: 开发模式下输出请求日志
    - 函数: request.post(url, options) - 预留（空实现，注释"RM-011 实现"）
    - module.exports: { get, post }
  - 参考: TECH_DESIGN.md Section 4.2, Section 2.3
  - **使测试通过**: T005 unit test
  - 验证: useMock 标志正确切换模式，错误处理完整

- [ ] **T016** [P] [US3] Impl - 创建 utils/config.js (环境配置)
  - 文件: `miniapp/utils/config.js`
  - 内容:
    - 常量: ENV = 'development' (可通过环境变量覆盖)
    - 配置对象: CONFIG = { development: { BASE_API_URL: '', USE_MOCK: true }, production: { BASE_API_URL: 'https://api.example.com/api/v1', USE_MOCK: false } }
    - module.exports: CONFIG[ENV]
  - 安全: **NO HARDCODED SECRETS** - production URL 为占位符或从环境变量读取
  - 参考: TECH_DESIGN.md Section 5.3
  - 验证: 配置对象结构正确，development 模式默认 USE_MOCK: true

**Checkpoint**: 此时 request.js 可返回 Mock 数据，测试 T004 和 T005 通过

---

## Phase 6: Integration (集成验证)

**Purpose**: 连接各组件，验证端到端流程

### Integration Tasks

- [ ] **T017** [US2] Integration - 连接 index 页面到 request.js
  - 文件: `miniapp/pages/index/index.js`
  - 修改: 实现 loadServices() 方法
    - 导入: `const request = require('../../utils/request.js');`
    - 调用: `request.get('/services', { useMock: true })`
    - 处理响应: `this.setData({ services: res.data, loading: false })`
    - 处理错误: `wx.showToast({ title: '加载失败', icon: 'none' })`
  - 调用时机: onLoad() 生命周期
  - 参考: TECH_DESIGN.md Section 4.2 "Example Usage"
  - **使测试通过**: T006 integration test
  - 验证: 页面加载时自动请求数据，services 数组包含3条记录

- [ ] **T018** [US2] Integration - 测试页面导航 (index → customer)
  - 文件: `miniapp/pages/index/index.wxml`
  - 添加: 导航按钮 `<button bindtap="goToCustomer">联系客服</button>`
  - 文件: `miniapp/pages/index/index.js`
  - 添加: goToCustomer() 方法 `wx.navigateTo({ url: '/pages/customer/customer' })`
  - 参考: PRD.md Story 2 AC5
  - **使测试通过**: T007 integration test
  - 验证: 点击按钮成功跳转到 customer 页面

- [ ] **T019** [P] Verification - 运行所有测试（必须全部通过）
  - 命令: `npm test` (from quickstart.md)
  - 预期: All 4 tests passing (T004, T005, T006, T007)
  - 预期: Test coverage report (if configured)
  - 验证: 无测试失败

- [ ] **T020** Verification - 手动测试在微信开发者工具
  - 打开项目在微信开发者工具
  - 验证: 项目编译成功（< 5s）
  - 验证: Index 页面加载并显示3个服务（占位文本 + 服务列表按钮）
  - 验证: 点击"联系客服"导航到 customer 页面
  - 验证: 代码包大小 < 500KB（查看编译信息）
  - 参考: quickstart.md "Verification Checklist"
  - 验证: 无控制台错误

**Checkpoint**: 所有用户故事 1, 2, 3 功能完整且可独立测试

---

## Phase 7: User Story 4 - 配置全局样式和设计系统 (Priority: P2)

**Goal**: 统一UI风格和视觉规范

**Independent Test**: 在 index 页面的 .wxss 文件中使用全局样式变量（如 var(--primary-color)），页面显示预期的颜色效果

### Implementation for User Story 4

- [ ] **T021** [US4] Impl - 定义全局样式变量在 app.wxss
  - 文件: `miniapp/app.wxss`
  - 添加: CSS Variables (小程序支持 CSS 变量)
    - 颜色系统:
      - `--primary-color: #07C160;` (微信绿)
      - `--secondary-color: #10AEFF;`
      - `--text-primary: #000000;`
      - `--text-secondary: #888888;`
      - `--bg-color: #F5F5F5;`
      - `--border-color: #E5E5E5;`
    - 字体系统:
      - `--font-size-xs: 24rpx;`
      - `--font-size-sm: 28rpx;`
      - `--font-size-base: 32rpx;`
      - `--font-size-lg: 36rpx;`
      - `--font-size-xl: 40rpx;`
    - 间距系统:
      - `--spacing-xs: 8rpx;`
      - `--spacing-sm: 16rpx;`
      - `--spacing-md: 24rpx;`
      - `--spacing-lg: 32rpx;`
      - `--spacing-xl: 48rpx;`
  - 参考: TECH_DESIGN.md Section 6.2 "Optimization Strategies", PRD.md Story 4 AC1-AC2
  - 验证: 变量定义完整，颜色值符合微信设计规范

- [ ] **T022** [US4] Impl - 在页面中使用全局样式变量
  - 文件: `miniapp/pages/index/index.wxss`
  - 修改:
    - `.container { padding: var(--spacing-md); background-color: var(--bg-color); }`
    - 添加示例文本样式使用变量: `.text { color: var(--text-primary); font-size: var(--font-size-base); }`
  - 文件: `miniapp/pages/customer/customer.wxss`
  - 修改:
    - `.container { padding: var(--spacing-md); }`
  - 参考: PRD.md Story 4 AC3
  - 验证: 页面样式正确应用全局变量，视觉效果符合预期

**Checkpoint**: 全局样式系统建立，页面使用统一设计变量

---

## Phase 8: Polish & Cross-Cutting Concerns (完善)

**Purpose**: 代码质量、文档、最终验证

### Polish Tasks

- [ ] **T023** [P] Polish - 代码质量检查
  - 运行: ESLint (if configured) 或手动检查
  - 验证: 无 TODO, FIXME, 或占位符注释（除预留方法的"RM-XXX 实现"注释）
  - 验证: 所有函数有 JSDoc 注释（描述参数和返回值）
  - 验证: 无 console.log（除 request.js 开发模式日志）
  - 验证: 无硬编码 API 地址或 AppID
  - 参考: Constitution Article I.1 (NO PARTIAL IMPLEMENTATION)
  - 验证: 通过 Constitution Check

- [ ] **T024** [P] Polish - 更新 EXECUTION_LOG.md
  - 文件: `devflow/requirements/RM-001/EXECUTION_LOG.md`
  - 记录: 所有已完成任务（T001-T023）
  - 记录: 完成时间戳（ISO 8601 UTC）
  - 记录: 任何偏离计划的决策
  - 记录: 性能指标（编译时间、包大小、加载时间）
  - 参考: TECH_DESIGN.md Section 6.5 "Performance Targets Summary"
  - 验证: 日志完整，格式规范

- [ ] **T025** Polish - 更新 README.md (项目根目录或 miniapp/)
  - 文件: `miniapp/README.md` (新建)
  - 内容:
    - 项目简介（陪玩服务平台小程序）
    - 目录结构说明
    - 如何运行（参考 quickstart.md）
    - 依赖说明（微信开发者工具 ≥3.0.0）
    - 下一步（RM-002, RM-003）
  - 参考: quickstart.md
  - 验证: README 内容清晰，可指导新开发者快速上手

- [ ] **T026** Verification - 运行 quickstart.md 验证清单
  - 执行: quickstart.md "Post-Implementation Checklist" 所有项
  - 验证:
    - [x] 17 files created
    - [x] 所有页面有 4 files
    - [x] utils/ 包含 request.js, mock.js, config.js
    - [x] 核心文件完整（app.js, app.json, app.wxss, project.config.json）
    - [x] 编译无错误，< 5s
    - [x] 代码包 < 500KB
    - [x] Index 页面加载成功
    - [x] Customer 页面加载成功
    - [x] 页面导航正常
    - [x] Mock 数据返回3个服务
    - [x] request.js 支持 useMock 标志
    - [x] 无 TODO 注释
    - [x] 无硬编码 secrets
    - [x] 所有函数有注释
  - 参考: quickstart.md "Verification Checklist"
  - 验证: 所有检查项通过

---

## Dependencies & Execution Order (依赖关系与执行顺序)

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Tests First (Phase 2)**: Depends on Setup (need project structure) - BLOCKS all implementation
- **User Story 1 (Phase 3)**: Depends on Tests First (need test framework setup)
- **User Story 2 (Phase 4)**: Depends on User Story 1 (need app.json with pages)
- **User Story 3 (Phase 5)**: Can run in parallel with Phase 4 (different files)
- **Integration (Phase 6)**: Depends on Phases 3, 4, 5 completion
- **User Story 4 (Phase 7)**: Can start after Phase 3 (need app.wxss)
- **Polish (Phase 8)**: Depends on all previous phases

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - Creates app.* files
- **User Story 2 (P1)**: Depends on US1 (need app.json to register pages)
- **User Story 3 (P1)**: Independent from US1/US2 (can run in parallel with US2)
- **User Story 4 (P2)**: Depends on US1 (need app.wxss to define variables)

### Within Each User Story

- **US1**: All tasks marked [P] can run in parallel (app.js, app.json, app.wxss, project.config.json - different files)
- **US2**: T012 and T013 marked [P] (different page directories)
- **US3**: T014 and T016 marked [P] (mock.js and config.js - different files), T015 depends on T014 and T016
- **US4**: T021 before T022 (define variables before using them)

### Parallel Opportunities

- **Phase 1**: All 3 Setup tasks can run in parallel [P]
- **Phase 2**: All 4 Test tasks can run in parallel [P]
- **Phase 3**: All 4 US1 tasks can run in parallel [P]
- **Phase 4**: T012 and T013 can run in parallel [P]
- **Phase 5**: T014 and T016 can run in parallel [P]
- **Phase 8**: T023 and T024 can run in parallel [P]

---

## Parallel Example: User Story 1 (Phase 3)

```bash
# Launch all core file creation tasks together:
Task T008: "Create app.js (application entry logic)"
Task T009: "Create app.json (global configuration)"
Task T010: "Create app.wxss (global styles)"
Task T011: "Create project.config.json (project configuration)"

# All 4 tasks can run in parallel because they modify different files
```

---

## Implementation Strategy (实施策略)

### MVP First (User Stories 1+2+3 Only)

1. Complete Phase 1: Setup (3 tasks, ~0.5 day)
2. Complete Phase 2: Tests First (4 tasks, ~0.5 day)
3. **TEST CHECKPOINT**: Verify all tests fail
4. Complete Phase 3: User Story 1 (4 tasks, ~0.5 day)
5. Complete Phase 4: User Story 2 (2 tasks, ~0.5 day)
6. Complete Phase 5: User Story 3 (3 tasks, ~0.5 day)
7. Complete Phase 6: Integration (4 tasks, ~0.5 day)
8. **STOP and VALIDATE**: Test MVP independently (US1+US2+US3)
9. Demo/deploy if ready

**Total MVP Effort**: ~3 days

### Incremental Delivery

1. **Week 1**: Setup + Tests + US1 + US2 + US3 + Integration → MVP ready
2. **Week 1 (optional)**: Add US4 (global styles) → Enhanced version
3. **Week 1**: Polish → Production-ready framework

### Parallel Team Strategy

With 2 developers:

1. Developer A: Phase 1 Setup + Phase 2 Tests (T001-T007)
2. Once Phase 2 done:
   - Developer A: Phase 3 US1 (T008-T011) + Phase 7 US4 (T021-T022)
   - Developer B: Phase 4 US2 (T012-T013) + Phase 5 US3 (T014-T016)
3. Both together: Phase 6 Integration (T017-T020)
4. Both together: Phase 8 Polish (T023-T026)

**Total Team Effort**: ~1.5-2 days with parallelization

---

## Notes (注意事项)

### Critical Rules
- **[P] = Parallel**: 只有不同文件、无依赖的任务才能标记 [P]
- **[US#] = Story Label**: 所有任务必须标记所属用户故事
- **Story Independence**: 每个用户故事应该独立可测试（US1, US2, US3 都有 Independent Test）
- **Tests First**: Phase 2 所有测试必须失败后才能进入 Phase 3
- **Commit Early**: 每完成一个任务就提交（至少每个 Phase 提交一次）
- **No Placeholders**: 禁止 TODO/FIXME（除预留方法的"RM-XXX 实现"注释）

### Common Pitfalls (常见陷阱)
- ❌ 跨用户故事的依赖（US2 依赖 US1 的 app.json 是合理的架构依赖）
- ❌ 标记 [P] 但任务修改同一文件（如 T015 不能与 T014 并行，因为 request.js 依赖 mock.js）
- ❌ 任务描述模糊，没有指定具体文件路径
- ❌ 忘记标记 [US#] 用户故事标签
- ❌ 实现前未写测试（违反 TDD）

### Best Practices (最佳实践)
- ✅ 每个用户故事独立可测试（US1, US2, US3 都有 Independent Test 标准）
- ✅ 一次只做一个任务，完成后立即提交
- ✅ 频繁在微信开发者工具中验证（每完成一个 Phase）
- ✅ 每个任务完成后运行测试（if configured）
- ✅ 每个 Phase 完成后 demo 给团队

---

## Progress Tracking (进度跟踪)

*在执行过程中更新*

### Overall Progress
- [ ] Phase 1: Setup (3 tasks)
- [ ] Phase 2: Tests First (4 tasks)
- [ ] **CHECKPOINT**: All tests failing ✓
- [ ] Phase 3: User Story 1 (4 tasks) 🎯 MVP
- [ ] Phase 4: User Story 2 (2 tasks) 🎯 MVP
- [ ] Phase 5: User Story 3 (3 tasks) 🎯 MVP
- [ ] Phase 6: Integration (4 tasks) 🎯 MVP
- [ ] Phase 7: User Story 4 (2 tasks)
- [ ] Phase 8: Polish (4 tasks)

**Total Tasks**: 26

### Test Coverage Status
- Contract Tests: 0 / 1 (T004)
- Unit Tests: 0 / 1 (T005)
- Integration Tests: 0 / 2 (T006, T007)
- Coverage: 0% → Target: N/A (manual testing for RM-001)

### User Story Completion
- [ ] US1 (P1): 0 / 4 tasks - Independent Test: PENDING
- [ ] US2 (P1): 0 / 2 tasks - Independent Test: PENDING
- [ ] US3 (P1): 0 / 3 tasks - Independent Test: PENDING
- [ ] US4 (P2): 0 / 2 tasks - Independent Test: PENDING

### Constitution Compliance

**Reference**: `.claude/constitution/project-constitution.md` (v2.0.0)

- [x] **Initial Check**: All 10 Articles validated at planning stage
- [x] **Article I-V**: Core principles checked (Quality, Architecture, Security, Performance, Maintainability)
- [x] **Article VI**: TDD sequence enforced (Phase 2 Tests → Phase 3+ Implementation)
- [x] **Article VII-IX**: Phase -1 Gates passed (Simplicity: 3 modules, Anti-Abstraction: direct wx.request, Integration-First: api-contract.json)
- [x] **Article X**: Requirement boundary validated (No speculative features, only PRD requirements)
- [ ] **Post-Implementation**: Constitution Check re-run after all tasks complete (T023)
- [ ] **Security Scan**: NO HARDCODED SECRETS verified (T023)
- [ ] **Code Review**: Architectural consistency verified (T023)

---

**Generated by**: planner agent
**Based on**: PRD.md, TECH_DESIGN.md, EPIC.md
**Constitution**: `.claude/constitution/project-constitution.md` v2.0.0
**Template Version**: 3.0.0 (User Story Centric + TDD Enforced)

---

## 相关文档

- **PRD**: `devflow/requirements/RM-001/PRD.md`
- **TECH_DESIGN**: `devflow/requirements/RM-001/TECH_DESIGN.md`
- **EPIC**: `devflow/requirements/RM-001/EPIC.md`
- **Constitution**: `.claude/constitution/project-constitution.md`
- **Quickstart**: `devflow/requirements/RM-001/quickstart.md`
- **Data Model**: `devflow/requirements/RM-001/data-model.md`
- **API Contract**: `devflow/requirements/RM-001/contracts/api-contract.json`
- **Execution Log**: `devflow/requirements/RM-001/EXECUTION_LOG.md`

---

## Validation Checklist (验证清单)

*GATE: 由 planner 在生成 tasks.md 后检查*

### User Story Organization ⚠️ CRITICAL
- [x] 每个用户故事有自己的 Phase (Phase 3-7)
- [x] 所有任务都有 [US#] 标签标记所属故事 (US1, US2, US3, US4)
- [x] 每个故事有 Independent Test 标准（在 Phase 标题中定义）
- [x] 每个故事有 Checkpoint 验证点
- [x] Phase 2 (Tests First) 是所有实现的前置条件

### Completeness (完整性)
- [x] 所有 API contracts 都映射到用户故事（GET /services → US3）
- [x] 所有 data entities 都映射到用户故事（Service entity → US3）
- [x] 所有用户故事都有对应的任务集合（US1: 4 tasks, US2: 2 tasks, US3: 3 tasks, US4: 2 tasks）
- [x] Setup 和 Tests First phase 明确定义

### Story Independence (故事独立性)
- [x] US1 可以独立实现和测试（创建核心文件，项目可编译）
- [x] US2 可以独立实现和测试（页面可导航，虽然依赖 US1 的 app.json）
- [x] US3 可以独立实现和测试（Mock 数据可返回）
- [x] US4 可以独立实现和测试（全局样式可应用）
- [x] 故事间依赖已明确标注（US2 依赖 US1 的 app.json）

### Parallel Safety (并行安全性)
- [x] 所有 [P] 标记的任务都操作不同文件
- [x] 同一文件的任务没有 [P] 标记（如 T015 request.js 依赖 T014 mock.js，无 [P]）
- [x] 有依赖关系的任务没有 [P] 标记

### Path Specificity (路径明确性)
- [x] 每个任务都指定了具体的文件路径（miniapp/...）
- [x] 路径使用了正确的项目结构约定（微信小程序标准结构）
- [x] 测试文件路径遵循 __tests__/ 目录结构

### Constitution Alignment (宪法符合性)

**Reference**: `.claude/constitution/project-constitution.md` (v2.0.0)

- [x] **Article I - Quality First**: 没有违反 NO PARTIAL IMPLEMENTATION，所有任务完整定义（无 TODO 除预留方法注释）
- [x] **Article II - Architectural Consistency**: 没有违反 NO CODE DUPLICATION，遵循微信小程序官方结构
- [x] **Article II - Anti-Over-Engineering**: 没有违反 NO OVER-ENGINEERING，架构简单适当（3模块）
- [x] **Article III - Security First**: 所有安全原则都有对应的任务（T011 NO HARDCODED SECRETS, T015 参数验证）
- [x] **Article VI - Test-First Development**: TDD顺序正确（Phase 2 Tests → Phase 3+ Implementation）
- [x] **Article X - Requirement Boundary**: 任务仅实现 PRD 明确的需求，无推测性功能

---

## Summary (总结)

### Task Breakdown Summary

- **Total Tasks**: 26
  - Setup: 3 tasks
  - Tests First: 4 tasks
  - User Story 1: 4 tasks
  - User Story 2: 2 tasks
  - User Story 3: 3 tasks
  - Integration: 4 tasks
  - User Story 4: 2 tasks
  - Polish: 4 tasks

- **MVP Critical Tasks**: 20 (Phases 1-6, excluding US4 and Polish)
- **Parallel Tasks**: 15 (marked with [P])
- **Sequential Tasks**: 11

### Key Implementation Strategy

1. **TDD Enforced**: Phase 2 tests must fail before Phase 3 implementation
2. **User Story Centric**: Each story (US1-US4) has clear goal and independent test
3. **Incremental Delivery**: MVP (US1+US2+US3) → Enhanced (US4) → Production (Polish)
4. **Parallel Execution**: 15 tasks can run in parallel (same file operations are sequential)

### Estimated Timeline

- **Single Developer**: 2.5-3 days (0.5 week as per ROADMAP)
- **Two Developers**: 1.5-2 days (with parallelization)
- **MVP Only**: 2 days (Phases 1-6)

### Next Steps After Completion

1. Run `/flow-qa "RM-001"` to generate TEST_PLAN.md and TEST_REPORT.md
2. Run `/flow-release "RM-001"` to create PR and release
3. Start RM-002 (小程序首页服务列表) - reuse miniapp/ framework
4. Start RM-003 (小程序客服入口) - reuse miniapp/ framework
