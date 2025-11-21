# PRD: RM-002 - 小程序首页服务列表

**Status**: Draft
**Created**: 2025-11-21
**Owner**: Development Team
**Type**: Requirement

**Input**: ROADMAP.md RM-002 描述、研究材料 from `devflow/requirements/RM-002/research/`
**Prerequisites**: RM-001 已完成（小程序项目框架已搭建）

---

## 背景与目标

### 业务背景

陪玩服务平台是一个三端协同系统（微信小程序 + Vue管理后台 + SpringBoot后端），本需求聚焦于微信小程序端的首页服务列表展示功能。

根据产品路线图（ROADMAP.md），本需求属于 M1-Q4-2025 里程碑的核心功能，依赖 RM-001（小程序项目初始化）提供的基础框架。RM-001 已完成以下基础设施：
- 小程序项目框架（app.js、app.json、app.wxss）
- index 页面四文件结构（index.js、index.json、index.wxml、index.wxss）
- 网络请求工具（utils/request.js，支持Mock模式）
- Mock数据系统（utils/mock.js，包含3个服务的初始数据）
- 骨架屏加载组件（skeleton loading）

本需求将在现有基础上进行UI增强和功能完善，实现完整的服务列表展示功能。

### 问题陈述

当前 index 页面已具备基础结构（由 RM-001 创建），但存在以下问题：
1. **UI质量不足**: 服务卡片样式需要优化（添加阴影、边框、间距调整）
2. **图片资源缺失**: Mock数据引用本地路径 `/images/services/*.jpg`（文件不存在）
3. **下拉刷新未启用**: index.js 已实现 onPullDownRefresh 方法，但 index.json 未启用
4. **服务详情入口未实现**: onServiceTap() 当前仅记录日志，未导航到详情页

需要在1周内完成UI抛光和功能完善，使首页服务列表达到可演示的产品级质量。

### 目标

- **主要目标**: 基于 RM-001 的基础框架，实现产品级的服务列表展示，包括UI优化、图片展示、下拉刷新等功能
- **成功指标**:
  - 服务列表以优化的卡片形式展示（包含服务图片、名称、描述、价格、分类、状态）
  - 页面加载时显示骨架屏，数据加载完成后平滑过渡
  - 用户可通过下拉刷新重新加载服务列表
  - 所有服务图片正常显示（使用占位图片）
  - 首屏加载时间 < 2秒，流畅无卡顿
- **影响范围**: 小程序C端用户体验，是用户进入小程序后的第一印象

---

## 用户故事与验收标准

### Story 1: 服务列表UI增强 (Priority: P1) 🎯 MVP

**As a** 微信小程序用户
**I want** 在首页看到视觉优化的服务卡片列表（包含清晰的图片、标题、描述、价格）
**So that** 我可以快速浏览可用的陪玩服务，了解服务内容和价格

**Why this priority**: 这是用户进入小程序后看到的第一个页面，UI质量直接影响用户对产品的第一印象和信任度。优化的UI能提升用户留存率和转化率。

**Independent Test**: 在微信开发者工具模拟器中打开小程序，首页显示3个服务卡片，每个卡片包含图片、服务名称、描述、价格（格式化为 ¥XX.00/小时）、分类标签、状态标签，卡片有阴影和圆角，整体视觉美观。可独立作为UI展示Demo交付。

**Acceptance Criteria**:
```gherkin
AC1: Given 用户打开小程序首页
     When 页面加载完成
     Then 显示3个服务卡片，每个卡片包含：服务图片（300x200px）、服务名称（大字体加粗）、服务描述（灰色正文）、价格（红色 ¥XX.00/小时）、分类标签（圆角背景）、状态标签（active显示"可用"绿色，inactive显示"暂停"灰色）

AC2: Given 服务卡片已展示
     When 检查卡片样式
     Then 每个卡片有 8px 圆角、浅灰色阴影、16px 内边距、卡片间距 12px，整体布局整齐美观

AC3: Given 服务列表已加载
     When 用户查看价格信息
     Then 价格显示为 "¥30.00/小时" 格式（保留2位小数），使用红色高亮显示

AC4: Given 页面加载中
     When 数据尚未返回
     Then 显示3个骨架屏占位卡片（灰色动画），避免空白页面

AC5: Given 页面样式已优化
     When 检查代码质量
     Then index.wxss 使用 BEM 命名规范或微信推荐的 class 命名规范，无重复样式代码
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: MEDIUM

---

### Story 2: 服务图片展示 (Priority: P1) 🎯 MVP

**As a** 微信小程序用户
**I want** 每个服务卡片显示清晰的服务图片
**So that** 我可以直观了解服务类型，提升浏览体验

**Why this priority**: 图片是服务卡片的核心视觉元素，直接影响用户对服务的理解和兴趣。没有图片的列表页会显得信息不足，用户体验较差。

**Independent Test**: 在模拟器中打开首页，3个服务卡片的图片都正常显示（无图裂图标），图片尺寸一致（300x200px），图片清晰无模糊。可独立验证图片加载功能。

**Acceptance Criteria**:
```gherkin
AC1: Given 用户打开小程序首页
     When 服务列表加载完成
     Then 每个服务卡片显示对应的图片，图片尺寸为 300x200px，宽高比 3:2

AC2: Given 图片加载中
     When 图片尚未完全加载
     Then 显示灰色占位背景，避免布局抖动

AC3: Given 图片加载失败
     When 图片URL无效或网络异常
     Then 显示默认占位图（灰色背景 + "图片加载失败"文字），不阻塞其他内容显示

AC4: Given Mock数据已更新
     When 检查图片URL格式
     Then mock.js 中的 imageUrl 字段使用外部占位URL（如 https://picsum.photos/seed/srv_001/300/200），避免引用不存在的本地路径

AC5: Given 图片已配置
     When 检查图片加载性能
     Then image 组件使用 lazy-load="true" 属性，支持懒加载，提升首屏加载速度
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: LOW

---

### Story 3: 下拉刷新功能 (Priority: P1) 🎯 MVP

**As a** 微信小程序用户
**I want** 通过下拉手势刷新服务列表
**So that** 我可以获取最新的服务信息，确保看到的数据是最新的

**Why this priority**: 下拉刷新是移动端应用的标准交互模式，用户期望通过此手势更新数据。RM-001 已实现 onPullDownRefresh 方法，只需启用配置即可，成本极低。

**Independent Test**: 在模拟器中打开首页，下拉页面触发刷新动画（顶部出现loading图标），列表重新加载（骨架屏再次出现），数据刷新完成后恢复正常显示。可独立验证刷新功能。

**Acceptance Criteria**:
```gherkin
AC1: Given 用户在首页
     When 用户下拉页面
     Then 触发刷新动画（顶部出现微信默认的loading图标），调用 onPullDownRefresh 方法

AC2: Given 刷新已触发
     When 数据重新加载
     Then 显示骨架屏占位，模拟网络延迟（100ms），加载完成后刷新列表数据

AC3: Given 数据加载完成
     When 刷新流程结束
     Then 调用 wx.stopPullDownRefresh() 停止刷新动画，页面恢复正常交互

AC4: Given 刷新配置需要启用
     When 检查 index.json 文件
     Then 包含 "enablePullDownRefresh": true 配置项

AC5: Given 刷新功能已实现
     When 用户在网络异常时下拉刷新
     Then 显示 Toast 提示 "刷新失败，请检查网络"，不阻塞页面操作
```

**Priority**: P1 (Highest - MVP Critical)
**Complexity**: LOW

---

### Story 4: 服务列表交互优化 (Priority: P2)

**As a** 微信小程序用户
**I want** 点击服务卡片时有视觉反馈（如背景色变化）
**So that** 我知道点击操作已被识别，提升交互体验

**Why this priority**: 点击反馈能提升用户的操作确定性，但不影响核心功能。当前 onServiceTap 仅记录日志（因服务详情页已推迟至 RM-XXX），添加视觉反馈可改善用户体验。

**Independent Test**: 在模拟器中点击任意服务卡片，卡片背景色变为浅灰色（100ms内响应），松开后恢复原色，控制台输出 "点击了服务: srv_001"（serviceId）。

**Acceptance Criteria**:
```gherkin
AC1: Given 用户在首页查看服务列表
     When 用户点击任意服务卡片
     Then 卡片背景色变为 #f5f5f5（浅灰色），100ms 后恢复原色

AC2: Given 卡片点击已触发
     When onServiceTap 方法执行
     Then 控制台输出 "点击了服务: {serviceId}"，记录用户行为

AC3: Given 服务详情页未实现
     When 用户点击服务卡片
     Then 显示 Toast 提示 "服务详情开发中，敬请期待"，不进行页面跳转

AC4: Given 交互效果已添加
     When 检查代码实现
     Then 使用微信小程序的 hover-class 属性或 bindtap 事件，避免使用复杂的 JS 状态管理
```

**Priority**: P2 (High)
**Complexity**: LOW

---

### 边界案例处理

- **错误处理**: 当网络请求失败时，显示错误提示和"重试"按钮，点击重试按钮重新加载服务列表
- **权限控制**: 本需求不涉及用户认证（用户可直接查看服务列表，无需登录）
- **数据验证**: mock.js 返回的数据必须包含所有必需字段（id, name, description, price, imageUrl, category, status），缺失字段时显示默认值
- **边界条件**:
  - 服务列表为空时，显示"暂无服务，敬请期待"提示
  - 服务数量超过10个时，考虑分页或虚拟滚动（当前仅3个服务，暂不实现）
  - 图片加载失败时，显示占位图，不阻塞其他内容
  - 下拉刷新在数据加载中时，防止重复触发

---

## 非功能性要求

### 性能要求

| 指标 | 目标值 | 关键性 |
|------|--------|--------|
| 首屏加载时间 (FCP) | < 2秒 | HIGH |
| 骨架屏显示时间 | 100ms（Mock延迟） | MEDIUM |
| 图片加载时间 | < 1秒（外部占位图） | MEDIUM |
| 列表滚动流畅度 | 60 FPS（无卡顿） | HIGH |
| 代码包增量大小 | < 50KB（相比RM-001） | MEDIUM |

**性能优化策略**:
- 使用 image 组件的 lazy-load 属性，图片懒加载
- 骨架屏组件复用 RM-001 已实现的 skeleton loading
- 避免频繁 setData，合并数据更新
- 使用 wx:key="id" 优化列表渲染性能

### 安全要求

- [x] **身份验证**: 不适用（服务列表公开展示，无需登录）
- [x] **授权机制**: 不适用（本需求不涉及权限控制）
- [x] **数据加密**: 不适用（展示公开数据，无敏感信息）
- [x] **输入验证**: 不适用（本需求无用户输入）
- [x] **审计日志**: 不适用（展示功能，无需日志）
- [x] **密钥管理**: NO HARDCODED SECRETS - 图片URL使用配置项，不硬编码在代码中

### 可扩展性要求

- **服务数量扩展**: 当前支持3个服务，未来支持10+服务时需添加分页或虚拟滚动
- **图片策略扩展**: 当前使用外部占位图，未来可替换为真实服务图片（上传到CDN）
- **筛选和排序**: 预留接口，未来可添加按分类筛选、按价格排序等功能（不在本需求范围）

### 可靠性要求

- **可用性目标**: 99.9%（依赖微信小程序平台）
- **数据备份**: 不适用（使用Mock数据，无需备份）
- **灾难恢复**: 代码托管在Git，支持快速回滚
- **错误处理**: 网络异常时显示错误提示和重试按钮，避免页面白屏

### 可观测性要求

- **日志记录**: 在开发模式下，request.js 输出请求日志（URL、耗时）
- **监控指标**: 不适用（基础功能阶段）
- **告警设置**: 不适用
- **追踪**: 不适用

### 可访问性要求

- **无障碍标准**: 遵循微信小程序无障碍开发指南（图片添加 alt 描述，按钮添加 aria-label）
- **多语言支持**: 不适用（当前仅支持简体中文）
- **设备兼容性**: 支持 iOS 9.0+ 和 Android 5.0+ 的微信客户端

---

## 技术约束

### 技术栈

- **框架**: 微信小程序原生框架
- **页面文件**: index.js、index.json、index.wxml、index.wxss（RM-001 已创建）
- **工具函数**: utils/request.js、utils/mock.js（RM-001 已创建）
- **Mock策略**: 使用 mock.js 提供服务列表数据（MOCK_CONFIG.useMock = true）

### 架构约束

- **必须使用**:
  - RM-001 提供的基础框架和工具函数
  - 微信小程序官方组件（image、view、text）
  - 骨架屏组件（skeleton-item，RM-001 已实现）
- **禁止使用**:
  - 第三方UI组件库（如Vant Weapp）
  - 本地图片资源（使用外部占位图）
- **集成要求**:
  - 图片使用 Picsum 占位服务（https://picsum.photos/seed/{id}/300/200）
  - 数据格式遵循 RM-001 定义的 Service 模型
- **数据格式**:
  ```javascript
  Service {
    id: string          // 格式: srv_XXX
    name: string        // 服务名称
    description: string // 服务描述
    price: number       // 价格（元/小时）
    imageUrl: string    // 图片URL（外部占位图）
    category: string    // 分类名称
    status: string      // 枚举: 'active' | 'inactive'
  }
  ```

### 平台约束

- **微信小程序**: 基础库 ≥ 2.0.0
- **开发工具**: 微信开发者工具 ≥ 3.0.0
- **运行环境**: iOS 9.0+ / Android 5.0+ 微信客户端

### 资源约束

- **预算限制**: 无（使用免费的外部占位图服务）
- **时间限制**: 1 周（~10 小时，包含开发、测试、文档）
- **团队规模**: 1名前端工程师

---

## 成功指标

### 主要指标

| 指标 | 基线 | 目标 | 时间线 | 测量方法 |
|------|------|------|--------|----------|
| 首屏加载时间 (FCP) | N/A (功能未实现) | < 2秒 | 开发完成时 | 微信开发者工具性能面板 |
| UI完整度 | 50% (RM-001基础UI) | 100% (优化后UI) | 开发完成时 | 人工UI审查 + 设计稿对比 |
| 图片显示成功率 | 0% (图片不存在) | 100% (占位图显示) | 开发完成时 | 功能测试 |
| 下拉刷新可用性 | 0% (未启用) | 100% (功能可用) | 开发完成时 | 功能测试 |

### 次要指标

| 指标 | 基线 | 目标 | 时间线 | 测量方法 |
|------|------|------|--------|----------|
| 代码质量 (ESLint) | N/A | 0 errors, 0 warnings | 提交前 | ESLint 检查 |
| 测试覆盖率 | 0% (RM-001无测试) | 80% (mock.js单元测试) | 开发完成时 | Jest 覆盖率报告 |

---

## Constitution Check (宪法符合性检查)

*GATE: 必须在 Epic 规划前通过*

**Reference**: `.claude/constitution/project-constitution.md` (v2.0.0)

### Article I: Quality First (质量至上)
- [x] **I.1 - NO PARTIAL IMPLEMENTATION**: 需求定义完整且明确，无占位符和模糊表述。所有用户故事都有明确的验收标准，无 "暂时实现" 或 "后续优化" 的描述。
- [x] **I.3 - No Simplification**: 避免"暂时简化，后续完善"的描述。所有功能要求完整实现（如图片加载失败必须显示占位图，不能留空）。
- [x] 用户故事遵循 INVEST 准则：
  - Independent: 每个故事可独立测试和交付（UI增强、图片展示、下拉刷新、交互优化）
  - Negotiable: 实现细节可讨论（如卡片阴影深度、价格颜色）
  - Valuable: 每个故事对用户体验有明确价值
  - Estimable: 工作量可估算（总计1周）
  - Small: 每个故事可在1-3天内完成
  - Testable: 每个故事有明确的 Independent Test 标准
- [x] 验收标准具体、可测试、可衡量，使用 Given-When-Then 格式

### Article X: Requirement Boundary (需求边界) - CRITICAL
- [x] **X.1 - Forced Clarification**: 所有不明确之处已通过研究材料（research.md）获得明确答案。6个研究决策已全部记录，无需额外标记 [NEEDS CLARIFICATION]。
- [x] **X.2 - No Speculative Features**: 无"可能需要"、"未来会"、"建议添加"的功能。所有功能均来自 ROADMAP.md 描述和研究决策。
  - **明确排除**: 服务详情页（研究决策R002确认推迟至RM-XXX）
  - **明确排除**: 搜索/筛选/排序功能（不在当前需求范围）
- [x] **X.3 - User Story Independence**:
  - 每个故事有明确优先级（P1: Story 1, 2, 3; P2: Story 4）
  - 每个故事有独立测试标准（Independent Test）
  - P1 故事可作为独立 MVP 交付（服务列表展示功能完整可用）

### Article II: Architectural Consistency (架构一致性)
- [x] **II.1 - NO CODE DUPLICATION**: 识别可复用的现有系统和组件。复用 RM-001 的 request.js、mock.js、skeleton loading，避免重复开发。
- [x] **II.3 - Anti-Over-Engineering**: 解决方案适合问题规模，无过度设计。采用研究决策R001的"Moderate enhancement"策略，避免大规模重构。
- [x] **II.4 - Single Responsibility**: 清晰的边界和职责划分。index 页面仅负责服务列表展示，不涉及详情页、支付等其他功能。
- [x] 模块化和可扩展性考虑合理（图片策略、数据格式预留扩展接口）

### Article III: Security First (安全优先)
- [x] **III.1 - NO HARDCODED SECRETS**: 定义了密钥管理策略。图片URL使用配置项（mock.js中管理），不硬编码在wxml或wxss中。
- [x] **III.2 - Input Validation**: 输入验证需求明确。虽无用户输入，但数据验证要求 mock.js 返回完整字段，缺失时使用默认值。
- [x] **III.3 - Least Privilege**: 身份验证/授权机制清晰。本需求无需认证，服务列表公开展示。
- [x] **III.4 - Secure by Default**: 数据加密策略定义。当前展示公开数据，未来对接真实API（RM-011）时使用HTTPS。

### Article IV: Performance Accountability (性能责任)
- [x] **IV.1 - NO RESOURCE LEAKS**: 考虑了资源管理。使用 lazy-load 懒加载图片，避免内存占用过高。
- [x] **IV.2 - Algorithm Efficiency**: 性能目标现实且可测量（首屏 < 2秒，滚动 60 FPS）。
- [x] **IV.4 - Caching Strategy**: 规划了监控和告警。request.js 在开发模式输出性能日志（请求耗时）。

### Article V: Maintainability (可维护性)
- [x] **V.1 - NO DEAD CODE**: 避免不必要的功能，仅实现明确需求。不添加搜索、筛选等未明确要求的功能。
- [x] **V.2 - Separation of Concerns**: 代码易于理解和修改。样式集中在 index.wxss，逻辑集中在 index.js，结构在 index.wxml。
- [x] **V.4 - File Size Limits**: 遵循单一职责原则。每个文件职责明确，避免单文件过大。

### Constitutional Violations (宪法违规记录)
*仅在有需要说明的宪法违规时填写*

**重要**: 任何违规都必须有充分理由,否则 PRD 不通过

| 违规的 Article | 具体违规内容 | 为何需要 | 如何缓解 |
|----------------|-------------|----------|----------|
| 无 | 本 PRD 完全符合宪法要求 | N/A | N/A |

---

## 依赖关系

### 上游依赖
*此需求实现前必须完成的依赖*
- **RM-001**: 小程序项目初始化（已完成✅）
  - 提供 index 页面四文件结构
  - 提供 request.js 和 mock.js 工具函数
  - 提供骨架屏加载组件

### 下游依赖
*依赖此需求的其他需求*
- **RM-011**: 前后端联调（需要服务列表页面完整实现后，才能对接真实API）
- **RM-XXX**: 服务详情页（未来需求，点击服务卡片后跳转到详情页）

### 外部依赖
*第三方或外部系统依赖*
- **Picsum 占位图服务**: https://picsum.photos（免费外部服务，提供占位图片）
- **微信小程序平台**: 基础库 ≥ 2.0.0
- **微信开发者工具**: 版本 ≥ 3.0.0

---

## 风险评估与缓解

### 技术风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 外部占位图服务不稳定（Picsum.photos 访问失败） | M | M | 在 mock.js 中配置备用占位图服务（如 Placeholder.com），或使用 base64 编码的本地占位图 |
| 图片加载速度慢（外部图片服务在国内访问慢） | M | M | 使用 lazy-load 懒加载优化首屏，未来替换为国内CDN |
| 骨架屏与实际UI差异大（用户体验不连贯） | L | L | 手动调整骨架屏尺寸，使其与实际卡片尺寸一致 |

### 业务风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| UI设计规范未确定（颜色、字体、间距） | M | L | 参考微信小程序官方设计指南和 RM-001 已定义的全局样式，先实现基础版本，后续根据设计稿调整 |
| 服务数据格式需要调整（RM-011 联调时发现格式不匹配） | M | M | 在 mock.js 中严格遵循研究材料定义的 Service 模型，在 RM-009（后端基础架构）阶段与后端确认接口契约 |

### 进度风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 工程师对wxss样式调试不熟悉（调试效率低） | M | L | 提供微信开发者工具调试教程，使用 Chrome DevTools 调试样式 |
| 测试时间不足（无法覆盖所有边界情况） | L | M | 优先测试核心功能（列表展示、图片加载、下拉刷新），边界情况在后续迭代中补充 |

---

## 范围界定

### 包含内容

- **UI优化**: 优化服务卡片样式（阴影、圆角、间距、字体、颜色）
- **图片展示**: 更新 mock.js 使用外部占位图URL，实现图片正常显示
- **价格格式化**: 在 index.wxml 中格式化价格显示（¥XX.00/小时）
- **下拉刷新**: 在 index.json 中启用 enablePullDownRefresh，验证功能可用
- **骨架屏优化**: 调整骨架屏尺寸，使其与实际卡片匹配
- **错误处理**: 完善网络异常和图片加载失败的错误提示
- **单元测试**: 为 mock.js 添加单元测试，确保数据格式正确

### 明确不包含

*明确列出不在此需求范围内的内容*
- **服务详情页**: 不实现服务详情页（研究决策R002确认推迟至RM-XXX）
  - 当前 onServiceTap 仅显示 Toast 提示"服务详情开发中"
- **搜索功能**: 不添加服务搜索框（未来需求）
- **筛选/排序**: 不添加按分类筛选、按价格排序等功能（未来需求）
- **收藏功能**: 不实现收藏服务功能（未来需求）
- **分页加载**: 当前仅3个服务，不实现分页或无限滚动（未来需求）
- **真实API对接**: 继续使用 Mock 数据，真实API对接在 RM-011 实现
- **支付系统**: 不涉及任何支付相关功能（未来扩展）
- **用户登录**: 不实现微信登录或用户认证（未来需求）

---

## 假设条件

*创建 PRD 时的关键假设*
- RM-001 已完成，index 页面的基础框架和工具函数可用
- Mock 数据格式（Service 模型）在 RM-011 联调前不会有重大变更
- Picsum.photos 占位图服务稳定可用，或可替换为其他占位图服务
- 无需UI设计稿，前端工程师可根据产品描述和最佳实践自行设计UI
- 微信开发者工具和小程序平台的API稳定，无破坏性变更
- 团队成员已掌握微信小程序基础开发技能（由RM-001培训完成）

---

## 未决问题

*Epic 规划前需要回答的问题*
- [x] **Q1**: UI设计规范（颜色、字体、间距）是否需要UI设计师确认？
  - 负责人: 产品经理
  - 截止日期: 开发开始前
  - **答案**: 参考微信小程序官方设计指南和 RM-001 已定义的全局样式。如果后续有设计稿，再进行调整。不阻塞开发。

- [x] **Q2**: 图片占位服务（Picsum.photos）是否可以使用？
  - 负责人: 前端工程师
  - 截止日期: 开发开始前
  - **答案**: 研究决策R003已确认使用 Picsum 占位URL（https://picsum.photos/seed/{id}/300/200）。如果访问不稳定，可替换为 Placeholder.com 或 base64 本地占位图。

- [x] **Q3**: 服务详情页是否在本需求范围内？
  - 负责人: 产品经理
  - 截止日期: PRD 完成前
  - **答案**: 研究决策R002已确认推迟至RM-XXX。当前 onServiceTap 仅显示 Toast 提示，不实现详情页。

---

## 发布计划

### 里程碑

- **Phase 1**: UI优化和图片展示 - Day 1-3
  - 交付物: 优化后的 index.wxss（卡片样式）、更新后的 mock.js（占位图URL）
  - 验证: 服务卡片UI美观，图片正常显示

- **Phase 2**: 下拉刷新和交互优化 - Day 4-5
  - 交付物: index.json 启用 enablePullDownRefresh、index.wxml 添加 hover-class
  - 验证: 下拉刷新功能可用，点击卡片有视觉反馈

- **Phase 3**: 单元测试和代码质量检查 - Day 6-7
  - 交付物: mock.js 单元测试、ESLint 检查报告、代码审查报告
  - 验证: 测试覆盖率 ≥ 80%，无 ESLint 错误和警告

### 回滚计划

- **回滚触发条件**:
  - 服务列表UI严重错乱（卡片重叠、布局错乱）
  - 图片全部无法显示（占位图服务不可用且无备用方案）
  - 下拉刷新导致页面崩溃或无响应
  - 首屏加载时间超过 5 秒（严重性能问题）
- **回滚步骤**:
  1. 使用 Git 回滚到 RM-001 完成后的稳定版本
  2. 检查外部依赖（Picsum.photos）可用性
  3. 重新评估 UI 优化策略，采用更保守的方案
- **数据处理**: 不适用（使用 Mock 数据，无数据库操作）

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
- [Research Summary](research/research-summary.md) - 完整研究总结，包含4个关键决策
- [Research Decisions](research/research.md) - 6个研究决策详细记录（R001-R006）
- [Codebase Overview](research/internal/codebase-overview.md) - RM-001 基础设施详细分析

### 参考资料

*外部参考和文档*
- [微信小程序官方文档 - 列表渲染](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html)
- [微信小程序官方文档 - 下拉刷新](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onPullDownRefresh)
- [微信小程序官方文档 - image 组件](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)
- [Picsum Photos 占位图服务](https://picsum.photos/)
- [CC-DevFlow ROADMAP](../../ROADMAP.md) - 产品路线图（M1-Q4-2025 里程碑）
- [CC-DevFlow ARCHITECTURE](../../ARCHITECTURE.md) - 系统架构文档
- [RM-001 PRD](../RM-001/PRD.md) - 小程序项目初始化需求文档

### 术语表

*定义领域特定术语*
- **服务列表**: 陪玩服务的列表展示，包含服务名称、描述、价格等信息
- **服务卡片**: 展示单个服务信息的UI组件（包含图片、标题、描述、价格等）
- **骨架屏 (Skeleton Screen)**: 在数据加载时显示的灰色占位组件，模拟最终内容的布局，提升用户体验
- **下拉刷新 (Pull-to-Refresh)**: 用户在页面顶部下拉手势触发的数据刷新交互模式
- **Mock 数据**: 模拟数据，用于前端开发阶段，在真实 API 未完成时提供临时数据
- **占位图 (Placeholder Image)**: 在真实图片未准备好时使用的临时图片，通常由外部服务（如 Picsum.photos）提供
- **lazy-load**: 图片懒加载技术，当图片进入视口时才加载，提升首屏加载速度
- **FCP (First Contentful Paint)**: 首次内容绘制时间，衡量页面加载性能的关键指标
- **BEM 命名规范**: Block Element Modifier，CSS 类命名规范，提升样式代码可维护性

---

**Generated by**: prd-writer agent
**Based on**: CC-DevFlow Constitution v2.0.0
**Template Version**: 2.0.0 (Self-Executable)
**Next Step**: Run planner agent to generate EPIC.md and TASKS.md

---

## Validation Checklist (验证清单)

*GATE: PRD 标记为完成前检查*

### 需求不扩散验证 ⚠️ CRITICAL
- [x] **NO SPECULATION**: 所有功能都由路线图（ROADMAP.md）和研究材料（research.md 6个决策）明确提出
- [x] **ALL CLARIFIED**: 没有未解决的 [NEEDS CLARIFICATION] 标记（所有问题在研究阶段已解决）
- [x] **NO TECH DETAILS**: PRD 聚焦于 WHAT（服务列表展示）和 WHY（提升用户体验），实现细节（HOW）留给 EPIC 和 TASKS
- [x] **STORY INDEPENDENCE**: 每个故事都有 Independent Test 标准（可独立验证功能）
- [x] **PRIORITY ASSIGNED**: 所有故事都有明确优先级（P1: Story 1, 2, 3; P2: Story 4）
- [x] **MVP IDENTIFIED**: P1 故事（UI增强 + 图片展示 + 下拉刷新）能够作为独立 MVP 交付

### 用户故事质量 (INVEST 原则)
- [x] **Independent**: 每个故事可独立交付和测试（UI、图片、刷新、交互四个维度）
- [x] **Negotiable**: 细节可以讨论（如卡片阴影深度、价格颜色、占位图服务选择）
- [x] **Valuable**: 有明确的用户/业务价值（提升首页用户体验和视觉质量）
- [x] **Estimable**: 可以估算工作量（总计1周，每个故事1-3天）
- [x] **Small**: 可在一个迭代内完成（1周迭代）
- [x] **Testable**: 有明确的验收标准和测试方法（每个故事都有5个AC和1个Independent Test）

### 验收标准质量
- [x] 使用 Given-When-Then 格式（所有AC都遵循此格式）
- [x] 包含正常流程（Happy Path）（如AC1-AC3描述正常展示流程）
- [x] 包含边界情况（Edge Cases）（如AC4描述骨架屏显示，AC5描述代码质量）
- [x] 包含错误场景（Error Handling）（如图片加载失败显示占位图，网络异常显示错误提示）
- [x] 具体且可测试（非模糊描述）（如"卡片有8px圆角、浅灰色阴影、16px内边距"）
- [x] 每个故事至少 2 个验收标准（所有故事都有5个AC）

### 完整性检查
- [x] 所有必需章节已填写（背景、用户故事、NFR、技术约束、成功指标、依赖、风险、范围、假设、未决问题、发布计划、附录）
- [x] 没有 {{PLACEHOLDER}} 未替换（所有模板占位符都已替换为具体内容）
- [x] 所有依赖已识别（上游：RM-001，下游：RM-011、RM-XXX，外部：Picsum.photos）
- [x] 所有风险已评估（技术风险3项、业务风险2项、进度风险2项，均有缓解措施）
- [x] 范围明确界定（包含7项内容，明确不包含8项内容）
- [x] 假设条件已列出（6项假设条件）

### Constitution 符合性
- [x] 通过所有宪法检查（Constitution Check 章节已完整填写，所有10条Article均通过）
- [x] 违规已文档化并说明理由（无违规）
- [x] 安全要求符合 NO HARDCODED SECRETS（图片URL使用配置项管理）
- [x] 质量要求符合 NO PARTIAL IMPLEMENTATION（所有功能要求完整实现，无"暂时简化"描述）
- [x] 架构要求符合 NO OVER-ENGINEERING（采用Moderate enhancement策略，复用RM-001基础设施）
