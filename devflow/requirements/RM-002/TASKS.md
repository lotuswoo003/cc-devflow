# Tasks: RM-002 - 小程序首页服务列表

**Input**: PRD.md, EPIC.md, TECH_DESIGN.md from `devflow/requirements/RM-002/`
**Prerequisites**: RM-001 已完成（小程序框架、mock数据、网络工具、骨架屏）

---

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- **ID**: T001, T002, T003... (sequential numbering)
- Include exact file paths in task descriptions

---

## Phase 1: Setup (共享基础设施)

**Purpose**: 项目初始化和所有用户故事共用的测试基础结构

**Duration**: 0.5小时

### 任务清单

- [ ] **T001** [P] 验证RM-001基础设施可用：检查 `miniapp/pages/index/` 四文件结构（index.js、index.json、index.wxml、index.wxss）存在且可运行
- [ ] **T002** [P] 验证RM-001工具函数可用：检查 `miniapp/utils/mock.js`、`miniapp/utils/request.js`、`miniapp/utils/config.js` 存在且功能正常
- [ ] **T003** [P] 安装Jest测试框架：在 `miniapp/` 目录运行 `npm install --save-dev jest @types/jest`
- [ ] **T004** 配置Jest：创建 `miniapp/jest.config.js` 文件，配置testMatch、collectCoverageFrom、coverageThreshold (≥80%)
- [ ] **T005** [P] 创建测试目录结构：创建 `miniapp/utils/__tests__/` 目录

**DoD**: Jest环境配置完成，`npm test` 可运行（虽无测试文件）

### Constitution Check (Phase 1)
- [x] **Article VII - Simplicity Gate**: 只安装必需的依赖（Jest仅开发依赖），无额外框架
- [x] **Article VIII - Anti-Abstraction**: 直接使用Jest，无自定义测试框架
- [x] **Article II - Architectural Consistency**: 测试目录结构遵循Jest约定（`__tests__/`）

### Code Review Checkpoint (Phase 1)
- [ ] **T006** 触发 `/code-reviewer` 子代理生成 `reviews/phase-1-setup_code_review.md`（报告需返回 `Phase Gate Result: Pass` 且 `decision` ∈ {approve, comment} 方可进入下一阶段）

---

## Phase 2: Tests First (TDD 测试优先) ⚠️

**Purpose**: 编写所有单元测试，验证测试失败后再进入实现阶段

**Duration**: 1小时

**⚠️ CRITICAL**: 所有测试必须在 Phase 3 之前完成并失败

### 任务清单

- [ ] **T007** [P] 编写 `getServices()` 单元测试：创建 `miniapp/utils/__tests__/mock.test.js`，测试返回完整Service数组（3个服务）、响应格式（code: 0, data: Service[], message: string）
- [ ] **T008** [P] 编写 `getServiceById()` 单元测试：在 `mock.test.js` 中添加测试，验证返回单个Service对象、服务不存在返回null或错误
- [ ] **T009** [P] 编写Service数据格式验证测试：在 `mock.test.js` 中添加测试，验证每个Service包含所有必需字段（id, name, description, price, imageUrl, category, status）
- [ ] **T010** [P] 编写imageUrl格式验证测试：在 `mock.test.js` 中添加测试，验证imageUrl是有效的HTTPS URL（Picsum格式）
- [ ] **T011** [P] 编写错误场景测试：在 `mock.test.js` 中添加测试，模拟网络错误、服务列表为空等边界情况

### TEST VERIFICATION CHECKPOINT ⚠️

- [ ] **T012** 运行测试验证失败：执行 `npm test`，验证所有测试失败（因为mock.js的imageUrl尚未更新为Picsum URL）
- [ ] **T013** 生成测试覆盖率报告：执行 `npm test -- --coverage`，确认覆盖率为0%（预期）
- [ ] **T014** 记录测试失败状态：在 `EXECUTION_LOG.md` 中记录"Phase 2 完成，所有测试失败（符合预期）"

**DoD**:
- `miniapp/utils/__tests__/mock.test.js` 完整（5个测试套件）
- `npm test` 运行结果：全部失败（EXPECTED）
- 测试覆盖报告生成（0% - EXPECTED）

**⚠️ CHECKPOINT**: 必须验证测试失败后才能进入 Phase 3

### Code Review Checkpoint (Phase 2)
- [ ] **T015** 触发 `/code-reviewer` 子代理生成 `reviews/phase-2-tests-first_code_review.md`（若 `Phase Gate Result: Fail` → 必须整改并重跑审查）

---

## Phase 3: User Story 1 - 服务列表UI增强 (Priority: P1) 🎯 MVP

**Goal**: 提供视觉优化的服务卡片，提升首页UI质量和用户体验

**Independent Test**: 在微信开发者工具模拟器中打开小程序，首页显示3个服务卡片，每个卡片包含图片、服务名称、描述、价格（格式化为 ¥XX.00/小时）、分类标签、状态标签，卡片有阴影和圆角，整体视觉美观

**Duration**: 2小时

**前提**: Phase 2 的所有测试已失败

### Implementation for User Story 1

- [ ] **T016** [US1] 优化服务卡片基础样式：更新 `miniapp/pages/index/index.wxss`，为 `.service-card` 添加 8rpx 圆角（border-radius）、浅灰色阴影（box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1)）、16rpx 内边距（padding）
- [ ] **T017** [P] [US1] 优化卡片间距：在 `miniapp/pages/index/index.wxss` 中为 `.service-list` 添加 12rpx 卡片间距（margin-bottom 或 gap）
- [ ] **T018** [P] [US1] 优化服务名称样式：在 `miniapp/pages/index/index.wxss` 中为 `.service-name` 添加样式（font-size: 32rpx, font-weight: bold, color: #333）
- [ ] **T019** [P] [US1] 优化服务描述样式：在 `miniapp/pages/index/index.wxss` 中为 `.service-desc` 添加样式（font-size: 28rpx, color: #666, line-height: 1.5, 文本超出2行省略）
- [ ] **T020** [P] [US1] 优化价格显示样式：在 `miniapp/pages/index/index.wxss` 中为 `.service-price` 添加样式（font-size: 36rpx, color: #ff4d4f, font-weight: bold）
- [ ] **T021** [US1] 格式化价格显示：更新 `miniapp/pages/index/index.wxml`，将价格绑定从 `{{item.price}}` 改为 `¥{{item.price.toFixed(2)}}/小时`
- [ ] **T022** [P] [US1] 优化分类标签样式：在 `miniapp/pages/index/index.wxss` 中为 `.service-category` 添加样式（圆角背景、padding、小字体、颜色区分）
- [ ] **T023** [P] [US1] 优化状态标签样式：在 `miniapp/pages/index/index.wxss` 中为 `.service-status` 添加样式（active显示绿色"可用"，inactive显示灰色"暂停"）
- [ ] **T024** [US1] 调整骨架屏尺寸：在 `miniapp/pages/index/index.wxml` 中调整骨架屏占位卡片尺寸，使其与实际卡片尺寸一致

**DoD**:
- UI验收通过（对比PRD AC1-AC5）
- 价格格式化为 "¥30.00/小时"
- 卡片样式完整（圆角、阴影、间距）

**Checkpoint**: 此时 User Story 1 应该完全功能且可独立测试

### Code Review Checkpoint (Phase 3)
- [ ] **T025** 触发 `/code-reviewer` 子代理生成 `reviews/phase-3-user-story-1_code_review.md`（任何整改项未关闭不得启动下一用户故事）

---

## Phase 4: User Story 2 - 服务图片展示 (Priority: P1) 🎯 MVP

**Goal**: 实现服务图片正常显示，解决本地图片不存在问题

**Independent Test**: 在模拟器中打开首页，3个服务卡片的图片都正常显示（无图裂图标），图片尺寸一致（300x200px），图片清晰无模糊

**Duration**: 1.5小时

### Implementation for User Story 2

- [ ] **T026** [P] [US2] 更新srv_001图片URL：在 `miniapp/utils/mock.js` 中，将 `srv_001` 的 imageUrl 从 `/images/services/game_1.jpg` 更新为 `https://picsum.photos/seed/srv_001/300/200`
- [ ] **T027** [P] [US2] 更新srv_002图片URL：在 `miniapp/utils/mock.js` 中，将 `srv_002` 的 imageUrl 从 `/images/services/voice_1.jpg` 更新为 `https://picsum.photos/seed/srv_002/300/200`
- [ ] **T028** [P] [US2] 更新srv_003图片URL：在 `miniapp/utils/mock.js` 中，将 `srv_003` 的 imageUrl 从 `/images/services/game_2.jpg` 更新为 `https://picsum.photos/seed/srv_003/300/200`
- [ ] **T029** [US2] 添加图片懒加载：在 `miniapp/pages/index/index.wxml` 中，为 `<image>` 组件添加 `lazy-load="true"` 属性
- [ ] **T030** [US2] 添加图片错误处理绑定：在 `miniapp/pages/index/index.wxml` 中，为 `<image>` 组件添加 `binderror="onImageError"` 事件
- [ ] **T031** [US2] 实现图片错误处理逻辑：在 `miniapp/pages/index/index.js` 中添加 `onImageError(e)` 方法，当图片加载失败时设置默认占位图（使用base64或本地备用图）
- [ ] **T032** [P] [US2] 添加图片加载占位背景：在 `miniapp/pages/index/index.wxss` 中为 `.service-image` 添加灰色背景（background-color: #f5f5f5），防止布局抖动
- [ ] **T033** [US2] 验证图片尺寸一致性：在 `miniapp/pages/index/index.wxss` 中为 `.service-image` 设置固定宽高（width: 300rpx, height: 200rpx），确保图片宽高比3:2

**DoD**:
- 3个服务图片都正常显示（Picsum URL）
- 图片懒加载启用
- 图片错误处理实现
- **Phase 2 测试通过**（imageUrl格式验证）

**让测试通过**: 运行 `npm test`，验证 Phase 2 的所有测试现在应该通过（imageUrl已更新为Picsum格式）

### Code Review Checkpoint (Phase 4)
- [ ] **T034** 触发 `/code-reviewer` 子代理生成 `reviews/phase-4-user-story-2_code_review.md`（确保审查结果在 PRD/EPIC 范围内全部通过）

---

## Phase 5: User Story 3 - 下拉刷新功能 (Priority: P1) 🎯 MVP

**Goal**: 启用下拉刷新，允许用户手动刷新服务列表

**Independent Test**: 在模拟器中打开首页，下拉页面触发刷新动画（顶部出现loading图标），列表重新加载（骨架屏再次出现），数据刷新完成后恢复正常显示

**Duration**: 0.5小时

### Implementation for User Story 3

- [ ] **T035** [US3] 启用下拉刷新配置：在 `miniapp/pages/index/index.json` 中添加 `"enablePullDownRefresh": true` 配置项
- [ ] **T036** [P] [US3] 配置刷新样式：在 `miniapp/pages/index/index.json` 中添加 `"backgroundTextStyle": "dark"` 配置（设置loading图标颜色）
- [ ] **T037** [US3] 验证下拉刷新方法：检查 `miniapp/pages/index/index.js` 中的 `onPullDownRefresh()` 方法是否正确实现（调用loadServices()，完成后调用wx.stopPullDownRefresh()）
- [ ] **T038** [US3] 真机测试下拉刷新：在真实iOS/Android设备上测试下拉刷新功能，验证刷新动画、骨架屏显示、数据重新加载
- [ ] **T039** [P] [US3] 添加刷新错误处理：在 `miniapp/pages/index/index.js` 的 `onPullDownRefresh()` 方法中添加错误处理，网络异常时显示Toast提示"刷新失败，请检查网络"

**DoD**:
- 下拉刷新功能可用（真机+模拟器）
- 刷新时显示骨架屏
- 错误处理完善

**Checkpoint**: 此时 User Stories 1, 2, 3 都应该独立工作

### Code Review Checkpoint (Phase 5)
- [ ] **T040** 触发 `/code-reviewer` 子代理生成 `reviews/phase-5-user-story-3_code_review.md`（继续前必须得到通过并确认无需求扩张）

---

## Phase 6: User Story 4 - 服务列表交互优化 (Priority: P2)

**Goal**: 添加点击反馈，提升交互体验

**Independent Test**: 在模拟器中点击任意服务卡片，卡片背景色变为浅灰色（100ms内响应），松开后恢复原色，控制台输出 "点击了服务: srv_001"（serviceId）

**Duration**: 1小时

### Implementation for User Story 4

- [ ] **T041** [US4] 添加点击反馈样式类：在 `miniapp/pages/index/index.wxss` 中定义 `.service-card-active` 样式（background-color: #f5f5f5）
- [ ] **T042** [US4] 绑定hover-class：在 `miniapp/pages/index/index.wxml` 中为服务卡片的 `<view>` 添加 `hover-class="service-card-active"` 属性
- [ ] **T043** [P] [US4] 配置hover时长：在 `miniapp/pages/index/index.wxml` 中为服务卡片的 `<view>` 添加 `hover-start-time="0"` 和 `hover-stay-time="100"` 属性
- [ ] **T044** [US4] 完善onServiceTap方法：在 `miniapp/pages/index/index.js` 中更新 `onServiceTap(e)` 方法，添加以下逻辑：
  ```javascript
  onServiceTap(e) {
    const { service } = e.currentTarget.dataset;
    console.log('点击了服务:', service.id);
    wx.showToast({
      title: '服务详情开发中，敬请期待',
      icon: 'none',
      duration: 2000
    });
  }
  ```
- [ ] **T045** [P] [US4] 测试点击反馈：在模拟器和真机上测试点击服务卡片，验证背景色变化（100ms内响应）、Toast提示显示

**DoD**:
- 点击反馈样式实现（hover-class）
- Toast提示显示
- 交互验证通过

**Checkpoint**: 所有用户故事（1, 2, 3, 4）现在都应该独立功能

### Code Review Checkpoint (Phase 6)
- [ ] **T046** 触发 `/code-reviewer` 子代理生成 `reviews/phase-6-user-story-4_code_review.md`（报告如含阻塞项，需完成整改再提交复审）

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 跨用户故事的改进和代码质量保证

**Duration**: 1.5小时

### 任务清单

- [ ] **T047** [P] 代码审查和清理：移除 `miniapp/pages/index/index.js` 中的调试代码（console.log，仅保留关键日志）
- [ ] **T048** [P] ESLint检查修复：运行 ESLint 检查 `miniapp/pages/index/` 和 `miniapp/utils/`，修复所有 errors 和 warnings
- [ ] **T049** [P] 代码格式化：使用 Prettier 或微信开发者工具格式化所有修改的文件（index.js, index.json, index.wxml, index.wxss, mock.js）
- [ ] **T050** 运行最终单元测试：执行 `npm test`，确认所有测试通过，测试覆盖率 ≥80%
- [ ] **T051** 生成测试覆盖率报告：执行 `npm test -- --coverage`，检查 `mock.js` 覆盖率是否达标
- [ ] **T052** [P] 性能测试：在微信开发者工具中使用性能面板测试首屏加载时间（FCP < 2秒）、列表滚动流畅度（60 FPS）
- [ ] **T053** [P] 真机兼容性测试：在iOS和Android真机上分别测试，验证UI显示一致、功能正常（图片加载、下拉刷新、点击反馈）
- [ ] **T054** 更新EXECUTION_LOG：在 `devflow/requirements/RM-002/EXECUTION_LOG.md` 中记录所有文件变更（modified: index.js, index.json, index.wxml, index.wxss, mock.js; created: mock.test.js, jest.config.js）
- [ ] **T055** [P] 添加代码注释：为关键逻辑添加注释（如onServiceTap、onImageError、onPullDownRefresh方法）
- [ ] **T056** 验证所有PRD验收标准：逐一检查PRD中的20个验收标准（AC1-AC5 for each user story），确认全部通过
- [ ] **T057** Git提交：创建Git commit，消息为 "feat(RM-002): implement service list UI enhancements\n\n- Optimize service card styling (shadows, borders, spacing)\n- Add Picsum placeholder images\n- Enable pull-to-refresh\n- Add tap interaction feedback\n- Add unit tests for mock.js (coverage ≥80%)"

**DoD**:
- 代码质量通过（ESLint clean）
- 测试覆盖率 ≥80%
- 性能基准达标（FCP < 2秒）
- 文档更新完成

### Code Review Checkpoint (Phase 7)
- [ ] **T058** 触发 `/code-reviewer` 子代理生成 `reviews/phase-7-polish_code_review.md`（必须 Pass 方可切换至 QA 流程）

---

## Dependencies & Execution Order (依赖关系与执行顺序)

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Tests First - MUST FAIL)
    ↓
TEST VERIFICATION CHECKPOINT ⚠️
    ↓
Phase 3 (US1: UI增强) ────────┐
    ↓                         │
Phase 4 (US2: 图片展示) ────────┤ (可并行，如有多人)
    ↓                         │
Phase 5 (US3: 下拉刷新) ────────┤
    ↓                         │
Phase 6 (US4: 交互优化) ────────┘
    ↓
Phase 7 (Polish)
```

**关键依赖关系**:
- **Setup (Phase 1)**: 无依赖 - 可立即开始
- **Tests First (Phase 2)**: 依赖 Setup 完成 - BLOCKS 所有用户故事
- **User Stories (Phase 3-6)**: 全部依赖 Phase 2 完成（测试已失败）
  - User stories 可以顺序执行（P1 → P2）
  - 或并行执行（如有多人，US1/US2/US3可同时进行）
- **Polish (Phase 7)**: 依赖所有用户故事完成

### User Story Dependencies

- **User Story 1 (P1)**: 可在 Phase 2 后开始 - 无依赖其他故事
- **User Story 2 (P1)**: 可在 Phase 2 后开始 - 独立于 US1（修改不同文件：mock.js vs index.wxss）
- **User Story 3 (P1)**: 可在 Phase 2 后开始 - 独立于 US1/US2（修改不同文件：index.json）
- **User Story 4 (P2)**: 可在 Phase 2 后开始 - 独立于 US1/US2/US3（但建议在UI稳定后添加交互）

### Within Each User Story

- **US1 (UI增强)**:
  - WXSS样式任务可并行（标记[P]）
  - WXML模板任务依赖样式完成
  - 骨架屏调整最后进行

- **US2 (图片展示)**:
  - 3个服务的imageUrl更新可并行（标记[P]，修改mock.js不同行）
  - 懒加载和错误处理可并行（标记[P]，修改WXML和JS不同部分）
  - 测试验证最后进行（让Phase 2测试通过）

- **US3 (下拉刷新)**:
  - index.json配置和验证方法检查可并行（标记[P]）
  - 真机测试最后进行

- **US4 (交互优化)**:
  - hover-class样式和配置可并行（标记[P]）
  - onServiceTap方法完善和测试顺序进行

### Parallel Opportunities

#### Setup阶段（Phase 1）
```bash
# 可并行执行的任务（不同文件）:
T001: 验证index页面结构
T002: 验证utils工具函数
T003: 安装Jest框架
T005: 创建测试目录
```

#### Tests阶段（Phase 2）
```bash
# 可并行编写的测试（不同测试套件）:
T007: getServices() 单元测试
T008: getServiceById() 单元测试
T009: Service数据格式验证
T010: imageUrl格式验证
T011: 错误场景测试
```

#### User Story 1阶段（Phase 3）
```bash
# 可并行执行的WXSS样式任务（不同class）:
T017: 优化卡片间距 (.service-list)
T018: 优化服务名称样式 (.service-name)
T019: 优化服务描述样式 (.service-desc)
T020: 优化价格显示样式 (.service-price)
T022: 优化分类标签样式 (.service-category)
T023: 优化状态标签样式 (.service-status)
```

#### User Story 2阶段（Phase 4）
```bash
# 可并行执行的imageUrl更新（mock.js不同行）:
T026: 更新srv_001图片URL
T027: 更新srv_002图片URL
T028: 更新srv_003图片URL

# 可并行执行的UI优化（不同文件）:
T032: 添加图片占位背景 (index.wxss)
T029: 添加图片懒加载 (index.wxml)
```

#### User Story 3阶段（Phase 5）
```bash
# 可并行执行的配置任务（index.json不同配置项）:
T035: 启用下拉刷新配置
T036: 配置刷新样式

# 可并行执行的验证和错误处理（不同方法）:
T037: 验证下拉刷新方法
T039: 添加刷新错误处理
```

#### User Story 4阶段（Phase 6）
```bash
# 可并行执行的样式和配置（WXML不同属性）:
T042: 绑定hover-class
T043: 配置hover时长

# 可并行执行的测试（不同设备）:
T045: 模拟器测试 + 真机测试
```

#### Polish阶段（Phase 7）
```bash
# 可并行执行的质量检查（不同维度）:
T047: 代码审查和清理
T048: ESLint检查修复
T049: 代码格式化
T052: 性能测试
T053: 真机兼容性测试
T055: 添加代码注释
```

---

## Parallel Example: Multi-Developer Workflow

**Scenario 1: Single Developer (Sequential)**
```
Day 1: Phase 1 (Setup) + Phase 2 (Tests First, verify fail)
Day 2: Phase 3 (US1: UI增强)
Day 3: Phase 4 (US2: 图片展示, tests pass)
Day 4: Phase 5 (US3: 下拉刷新)
Day 5: Phase 6 (US4: 交互优化)
Day 6-7: Phase 7 (Polish)
```

**Scenario 2: Multiple Developers (Parallel User Stories)**
```
Day 1 (All): Phase 1 (Setup) + Phase 2 (Tests First, verify fail)
Day 2-3:
  - Developer A: Phase 3 (US1: UI增强)
  - Developer B: Phase 4 (US2: 图片展示)
  - Developer C: Phase 5 (US3: 下拉刷新)
Day 4:
  - Developer A: Phase 6 (US4: 交互优化)
  - Developer B/C: Code review for US1/US2/US3
Day 5-6 (All): Phase 7 (Polish, integration testing)
```

**Key Parallelization Points**:
- ✅ US1 (index.wxss) + US2 (mock.js) + US3 (index.json) 可并行（不同文件）
- ✅ US1内部的多个WXSS class定义可并行（不同选择器）
- ⚠️ US2的imageUrl更新和Phase 2测试验证必须顺序（需要imageUrl更新后测试才能通过）
- ⚠️ Phase 7的Polish任务建议顺序执行（确保集成稳定）

---

## Implementation Strategy (实施策略)

### MVP First (User Story 1-3 Only, 快速交付)

1. **Day 1**: Complete Phase 1 (Setup) + Phase 2 (Tests First, verify fail)
2. **Day 2**: Complete Phase 3 (US1: UI增强)
3. **Day 3**: Complete Phase 4 (US2: 图片展示, tests pass)
4. **Day 4**: Complete Phase 5 (US3: 下拉刷新)
5. **STOP and VALIDATE**:
   - Test US1/US2/US3 independently
   - Verify all PRD P1 acceptance criteria (AC1-AC5 for US1/US2/US3)
   - Deploy/demo if ready (MVP = 服务列表展示完整可用)
6. **Optional**: Add US4 (交互优化, P2) if time allows

### Incremental Delivery (逐个用户故事交付)

1. Complete Setup + Tests First → Foundation ready
2. Add User Story 1 → Test independently → Checkpoint (UI优化完成)
3. Add User Story 2 → Test independently → Checkpoint (图片显示完成, tests pass)
4. Add User Story 3 → Test independently → Checkpoint (下拉刷新完成)
5. Add User Story 4 → Test independently → Checkpoint (交互反馈完成)
6. Polish → Final validation → Deploy

### Parallel Team Strategy (多人并行开发)

With 2-3 developers:

1. **All together**: Complete Setup + Tests First (Day 1)
2. **Parallel execution** (Day 2-4):
   - Developer A: User Story 1 (UI增强) - Focus on WXSS styling
   - Developer B: User Story 2 (图片展示) - Focus on mock.js and image handling
   - Developer C: User Story 3 (下拉刷新) + User Story 4 (交互优化)
3. **Integration** (Day 5-6):
   - Code review for all user stories
   - Resolve merge conflicts (if any)
   - Polish and final testing
4. Stories complete and integrate independently

---

## Notes (注意事项)

### Critical Rules
- **[P] = Parallel**: 只有不同文件、无依赖的任务才能标记 [P]
- **[US#] = Story Label**: 所有任务必须标记所属用户故事（US1, US2, US3, US4）
- **Story Independence**: 每个用户故事应该独立可测试（US1=UI优化, US2=图片显示, US3=下拉刷新, US4=交互反馈）
- **Tests First**: Phase 2 必须完成且测试失败，才能开始用户故事实现
- **Commit Early**: 每完成一个Phase就提交，便于回滚和Code Review
- **Code Review Checkpoints**: 每个 Phase 结束后必须触发 `/code-reviewer` 子代理审查，通过后方可继续

### Common Pitfalls (常见陷阱)
- ❌ 跨用户故事的依赖（破坏独立性） - RM-002的4个故事完全独立
- ❌ 标记 [P] 但任务修改同一文件 - 检查任务文件路径，同文件任务不能并行
- ❌ 任务描述模糊，没有指定具体文件路径 - 所有任务都已指定完整路径
- ❌ 忘记标记 [US#] 用户故事标签 - 所有Phase 3-6任务都已标记
- ❌ Phase 2测试通过后才开始用户故事 - 测试必须先失败，Phase 4让测试通过

### Best Practices (最佳实践)
- ✅ 每个用户故事独立可测试（US1=UI, US2=图片, US3=刷新, US4=交互）
- ✅ 一次只做一个用户故事（或并行多个独立故事）
- ✅ 频繁提交，小步前进（每个Phase完成后提交）
- ✅ 运行测试验证（Phase 2测试失败 → Phase 4测试通过）
- ✅ 每个故事完成后 demo（验证Independent Test标准）
- ✅ 使用Code Review Checkpoints保证代码质量（每个Phase结束后）
- ✅ 严格对照PRD和EPIC进行需求边界审查（避免需求扩散）

### File Modification Summary
- **Modified Files** (RM-002 changes):
  - `miniapp/pages/index/index.js` (onImageError, onServiceTap完善)
  - `miniapp/pages/index/index.json` (enablePullDownRefresh启用)
  - `miniapp/pages/index/index.wxml` (价格格式化, lazy-load, hover-class)
  - `miniapp/pages/index/index.wxss` (卡片样式优化, 分类/状态标签, hover反馈)
  - `miniapp/utils/mock.js` (imageUrl更新为Picsum URL)
- **Created Files** (new in RM-002):
  - `miniapp/utils/__tests__/mock.test.js` (Jest单元测试)
  - `miniapp/jest.config.js` (Jest配置)
- **Unchanged Files** (from RM-001, reused):
  - `miniapp/utils/request.js` (网络请求工具)
  - `miniapp/utils/config.js` (配置管理)
  - `miniapp/app.js/json/wxss` (全局配置和样式)

---

## Progress Tracking (进度跟踪)

*在执行过程中更新*

### Overall Progress
- [ ] Phase 1: Setup (5 tasks) - Jest环境配置
- [ ] Phase 2: Tests First (9 tasks) - 单元测试编写（预期失败）
- [ ] **CHECKPOINT**: Tests verified failed ✓
- [ ] Phase 3: User Story 1 (10 tasks) - UI增强 🎯 MVP
- [ ] Phase 4: User Story 2 (8 tasks) - 图片展示 🎯 MVP (tests pass)
- [ ] Phase 5: User Story 3 (5 tasks) - 下拉刷新 🎯 MVP
- [ ] Phase 6: User Story 4 (5 tasks) - 交互优化
- [ ] Phase 7: Polish (11 tasks) - 代码质量和最终验证

### Test Coverage Status
- Contract Tests: N/A (mock模式，无API contract tests)
- Integration Tests: N/A (单页面UI增强，无复杂集成)
- Unit Tests: 0 / 5 (Phase 2创建，Phase 4让测试通过)
- Coverage: 0% → Target: ≥80%

### User Story Completion
- [ ] US1 (P1): 0 / 10 tasks - Independent Test: ❌ (UI增强未完成)
- [ ] US2 (P1): 0 / 8 tasks - Independent Test: ❌ (图片显示未完成)
- [ ] US3 (P1): 0 / 5 tasks - Independent Test: ❌ (下拉刷新未启用)
- [ ] US4 (P2): 0 / 5 tasks - Independent Test: ❌ (交互反馈未实现)

### Constitution Compliance

**Reference**: `.claude/constitution/project-constitution.md` (v2.0.0)

- [x] **Initial Check**: All 10 Articles validated at planning stage (EPIC.md)
- [ ] **Article I-V**: Core principles checked (Quality, Architecture, Security, Performance, Maintainability)
- [ ] **Article VI**: TDD sequence enforced (Phase 2 Tests First → Phase 3-6 Implementation)
- [ ] **Article VII-IX**: Phase -1 Gates passed (Simplicity: 1 module, Anti-Abstraction: direct wx APIs, Integration-First: contracts defined)
- [ ] **Article X**: Requirement boundary validated (No speculative features: 无详情页/搜索/筛选)
- [ ] **Post-Implementation**: Constitution Check re-run after all tasks complete (Phase 7)
- [ ] **Security Scan**: No high-severity issues (NO HARDCODED SECRETS verified)
- [ ] **Code Review**: Architectural consistency verified (Code Review Checkpoints for each Phase)

### Quality Gates Status
- [ ] **Phase 1 Gate**: Setup complete, Jest configured
- [ ] **Phase 2 Gate**: Tests written and FAILED (expected)
- [ ] **Phase 3 Gate**: US1 UI enhancements complete, Independent Test passed
- [ ] **Phase 4 Gate**: US2 image display complete, Phase 2 tests PASSED
- [ ] **Phase 5 Gate**: US3 pull-to-refresh complete, Independent Test passed
- [ ] **Phase 6 Gate**: US4 tap feedback complete, Independent Test passed
- [ ] **Phase 7 Gate**: All quality checks passed (ESLint, coverage ≥80%, performance)

---

**Generated by**: planner agent
**Based on**: PRD.md (4 user stories, 20 acceptance criteria), EPIC.md (7 phases, TDD enforced), TECH_DESIGN.md (Service model, API contracts)
**Constitution**: `.claude/constitution/project-constitution.md` v2.0.0
**Template Version**: 3.0.0 (User Story Centric + TDD Enforced + Code Review Integration)
**Total Tasks**: 58 (5 Setup + 9 Tests + 10 US1 + 8 US2 + 5 US3 + 5 US4 + 11 Polish + 5 Code Review Checkpoints)

---

## 相关文档

- **PRD**: `devflow/requirements/RM-002/PRD.md` - 4个用户故事，20个验收标准
- **EPIC**: `devflow/requirements/RM-002/EPIC.md` - 技术方案，Phase -1 Gates通过
- **TECH_DESIGN**: `devflow/requirements/RM-002/TECH_DESIGN.md` - Service模型，API契约
- **Constitution**: `.claude/constitution/project-constitution.md` - v2.0.0, 10条Articles
- **Execution Log**: `devflow/requirements/RM-002/EXECUTION_LOG.md` - 文件变更记录

---

## Validation Checklist (验证清单)

*GATE: Tasks 标记为完成前检查*

### User Story Organization ⚠️ CRITICAL
- [x] 每个用户故事有自己的 Phase (Phase 3: US1, Phase 4: US2, Phase 5: US3, Phase 6: US4)
- [x] 所有任务都有 [US#] 标签标记所属故事（US1, US2, US3, US4）
- [x] 每个故事有 Independent Test 标准（4个Independent Test已定义）
- [x] 每个故事有 Checkpoint 验证点（每个Phase末尾有Checkpoint）
- [x] Setup/Tests First phase 只包含共享基础设施（Phase 1: Jest配置，Phase 2: 单元测试）

### Completeness (完整性)
- [x] 所有 API contracts 都映射到用户故事（GET /services用于所有故事的数据加载）
- [x] 所有 data entities 都映射到用户故事（Service模型用于所有故事）
- [x] 所有用户故事都有对应的任务集合（US1: 10 tasks, US2: 8 tasks, US3: 5 tasks, US4: 5 tasks）
- [x] Setup 和 Tests First phase 明确定义（Phase 1: 5 tasks, Phase 2: 9 tasks）

### Story Independence (故事独立性)
- [x] US1 可以独立实现和测试（UI增强，仅修改index.wxss和index.wxml）
- [x] US2 可以独立实现和测试（图片展示，主要修改mock.js和image组件）
- [x] US3 可以独立实现和测试（下拉刷新，仅修改index.json和验证index.js）
- [x] US4 可以独立实现和测试（交互反馈，添加hover-class和Toast）
- [x] 故事间依赖已明确标注（US2依赖Phase 2测试通过，其他故事独立）

### Parallel Safety (并行安全性)
- [x] 所有 [P] 标记的任务都操作不同文件（如T017-T023都修改index.wxss不同class）
- [x] 同一文件的任务没有 [P] 标记（如T016和T021都修改index.wxss，按顺序执行）
- [x] 有依赖关系的任务没有 [P] 标记（如T012依赖T007-T011完成）

### Path Specificity (路径明确性)
- [x] 每个任务都指定了具体的文件路径（所有任务都包含完整路径）
- [x] 路径使用了正确的项目结构约定（miniapp/pages/index/, miniapp/utils/）
- [x] 测试文件路径遵循 tests/ 目录结构（miniapp/utils/__tests__/mock.test.js）

### TDD Enforcement (TDD强制执行)
- [x] Phase 2 明确为"Tests First"，所有测试必须先失败
- [x] TEST VERIFICATION CHECKPOINT 明确标记（T012-T014）
- [x] Phase 4 让测试通过（T026-T028更新imageUrl后，Phase 2测试通过）
- [x] 测试覆盖率目标明确（≥80%）

### Constitution Alignment (宪法符合性)

**Reference**: `.claude/constitution/project-constitution.md` (v2.0.0)

- [x] **Article I - Quality First**: 没有违反 NO PARTIAL IMPLEMENTATION（所有任务完整定义，无TODO或占位符）
- [x] **Article II - Architectural Consistency**: 没有违反 NO CODE DUPLICATION（复用RM-001基础设施）
- [x] **Article II - Anti-Over-Engineering**: 没有违反 NO OVER-ENGINEERING（仅增强1个页面，架构适度）
- [x] **Article III - Security First**: 所有安全原则都有对应的任务（imageUrl在mock.js配置，无硬编码）
- [x] **Article VI - Test-First Development**: TDD顺序正确（Phase 2测试先行 → Phase 3-6实现）
- [x] **Article X - Requirement Boundary**: 任务仅实现PRD明确的需求（无详情页、搜索、筛选等推测性功能）

### Code Review Integration (代码审查集成) 🆕
- [x] **每个 Phase 都有 Code Review Checkpoint**（Phase 1-7各有1个Code Review任务）
- [x] **Code Review 路径规范**（使用 `reviews/phase-*-*_code_review.md` 格式）
- [x] **审查触发机制明确**（使用 `/code-reviewer` 子代理）
- [x] **审查结果要求明确**（Phase Gate Result: Pass，decision ∈ {approve, comment}）
- [x] **需求边界审查**（所有审查必须对照 PRD.md 和 EPIC.md，防止需求扩散）

---

**Tasks 完成状态**: ✅ **COMPLETE** - 准备好开始执行（/flow-dev RM-002）
