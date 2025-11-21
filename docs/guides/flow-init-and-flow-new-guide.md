# Flow-Init 与 Flow-New 命令学习指南

> **文档版本**: 1.0.0
> **最后更新**: 2025-11-21
> **目标受众**: CC-DevFlow 用户、开发者

---

## 📋 目录

1. [概览](#概览)
2. [Flow-Init 命令详解](#flow-init-命令详解)
3. [Flow-New 命令详解](#flow-new-命令详解)
4. [命令对比](#命令对比)
5. [使用场景建议](#使用场景建议)
6. [实际使用示例](#实际使用示例)
7. [执行流程详解](#执行流程详解)
8. [常见问题解答](#常见问题解答)
9. [最佳实践](#最佳实践)

---

## 概览

### 命令定位

**`/flow-init`** - 需求初始化命令（阶段化）
- 🎯 **定位**: 开发流程的第一步，专注于需求初始化和调研准备
- 🔧 **特点**: 精细控制、深度调研、状态初始化
- 👥 **适用**: 需要逐步推进的复杂项目

**`/flow-new`** - 一键完整开发流（包装器）
- 🎯 **定位**: 端到端自动化流程，从 PRD 到发布
- 🔧 **特点**: 全自动执行、包含所有阶段、适合快速开发
- 👥 **适用**: 简单明确的需求、快速原型开发、学习演示

### 设计理念

```text
┌─────────────────────────────────────────────────────────┐
│                    CC-DevFlow 工作流                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  /flow-init  →  单步执行模式（阶段化命令）                │
│  ├─ 初始化                                                │
│  ├─ 深度调研                                              │
│  └─ 状态准备                                              │
│                                                           │
│  /flow-new   →  一键自动化模式（包装器）                  │
│  └─ 调用 /flow-init + 6个后续阶段                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Flow-Init 命令详解

### 命令格式

```bash
# 基础格式
/flow-init "REQ_ID|TITLE"

# 交互模式
/flow-init --interactive

# 示例
/flow-init "REQ-123|用户认证系统"
/flow-init "BUG-456|修复登录超时问题"
```

### 核心功能

#### 1️⃣ 目录结构初始化

创建单轨需求目录：

```text
devflow/requirements/REQ-123/
├── research/                    # 调研资料目录
│   ├── internal/               # 内部代码库分析
│   │   └── codebase-overview.md
│   ├── mcp/                    # 外部资料（MCP抓取）
│   │   └── 20251121/           # 按日期组织
│   │       ├── official/       # 官方文档
│   │       ├── guides/         # 教程资源
│   │       ├── tutorials/      # 详细教程
│   │       └── examples/       # 代码示例
│   ├── tasks.json              # 研究任务追踪
│   └── research.md             # 研究结论整合
├── README.md                    # 工作流指南
├── EXECUTION_LOG.md            # 执行日志
└── orchestration_status.json   # 状态管理
```

#### 2️⃣ 深度调研工作流（必做）

**阶段 2.5**: MCP 强制流程

```text
🧭 Step 0: 现有代码调研（必做）
   → 运行前置检查脚本获取仓库基线
   → 浏览现有文档和模块
   → 输出: research/internal/codebase-overview.md

📦 Step 1: 获取官方文档（Context7 MCP）
   → 调用: resolve-library-id("<关键词>")
   → 调用: get-library-docs(library_id, tokens=5000)
   → 保存: research/mcp/official/${library_id}-docs.md

🔍 Step 2: 搜索领域教程（Web Search）
   → 搜索: "<主题> tutorial site:<权威域名>"
   → 保存索引: research/mcp/guides/resources.md

📥 Step 3: 下载核心资料（WebFetch）
   → 抓取 2-3 篇高价值文章
   → 转换为 Markdown（保留原文）
   → 保存: research/mcp/tutorials/${slug}.md

💡 Step 4: 搜集实践案例（Web Search + WebFetch）
   → 搜索: "<能力> example site:github.com"
   → 抓取示例说明和代码片段
   → 保存: research/mcp/examples/${slug}.md

📝 Step 5: 生成调研摘要
   → 创建: research/research-summary.md
   → 汇总所有资料的结论和推荐用法
```

**重要**: 所有远程抓取的原始资料以 `.md` 文件原样保存，任何摘要在 `research-summary.md` 中编写。

#### 3️⃣ 研究任务管理（阶段 2.6）

```bash
# 1. 生成研究任务
generate-research-tasks.sh "${REQ_DIR}"
# 输出: research/tasks.json

# 2. 填充研究决策
populate-research-tasks.sh "${REQ_DIR}"
# 从 research-summary.md 提取决策信息

# 3. 整合研究结论
consolidate-research.sh "${REQ_DIR}"
# 输出: research/research.md（标准格式）
```

**research.md 标准格式**:

```markdown
## Research Summary

## Decisions

### R001 — 技术选型决策
- **Decision**: 使用 Next.js 14 + TypeScript
- **Rationale**:
  - Server Components 支持 SSR/SSG 混合
  - TypeScript 提供类型安全
  - 团队已有 React 经验
- **Alternatives considered**:
  - Remix: 学习曲线较陡
  - Vue 3 + Nuxt: 团队不熟悉

### R002 — 数据库选择
- **Decision**: PostgreSQL + Prisma ORM
- **Rationale**: ...
- **Alternatives considered**: ...

## Source Library
- [Next.js 文档](research/mcp/official/nextjs-docs.md)
- [Prisma 最佳实践](research/mcp/guides/prisma-guide.md)
```

#### 4️⃣ Git 分支创建

```bash
# 需求分支
feature/REQ-123-用户认证系统

# BUG 修复分支
bugfix/BUG-456-修复登录超时
```

#### 5️⃣ 状态初始化

**orchestration_status.json**:

```json
{
  "reqId": "REQ-123",
  "title": "用户认证系统",
  "status": "initialized",
  "phase": "planning",
  "phase0_complete": true,
  "createdAt": "2025-11-21T06:30:00Z",
  "updatedAt": "2025-11-21T06:30:00Z"
}
```

### Exit Gate 检查（5级质量控制）

```text
✅ LEVEL 1: 文件存在性检查
   - REQ_DIR/ 目录存在
   - research/ 目录存在
   - research/internal/ 目录存在
   - README.md、EXECUTION_LOG.md、orchestration_status.json 存在
   - research/research.md、research/tasks.json 存在

✅ LEVEL 2: research.md 结构验证
   - 必须包含 "## Research Summary" 章节
   - 必须包含 "## Decisions" 章节
   - 至少 1 个 "### R00X —" 决策块
   - 必须包含 "## Source Library" 章节

✅ LEVEL 3: research.md 内容质量
   - 无 TODO 标记
   - 无 {{PLACEHOLDER}} 占位符
   - 每个决策块包含 Decision/Rationale/Alternatives

✅ LEVEL 4: 研究任务验证
   - research/tasks.json 为有效 JSON
   - 包含 "tasks" 数组
   - 至少 1 个任务状态 != "open"

✅ LEVEL 5: Git/状态/Constitution
   - Git 分支创建成功
   - orchestration_status.json 状态正确
   - EXECUTION_LOG.md 包含所有操作记录
   - 符合 Constitution Article X（强制澄清）
```

### 命令输出

```text
✅ Requirement structure initialized successfully!

Requirement ID:    REQ-123
Type:              requirement
Directory:         devflow/requirements/REQ-123
Title:             用户认证系统
Git Branch:        feature/REQ-123-用户认证系统

调研完成:
  - 内部代码调研: research/internal/codebase-overview.md
  - 外部资料抓取: 6 个文件
  - 研究任务: 3 个已完成
  - 研究结论: research/research.md (2 个决策)

Next Steps:
  1. 查看 research/research.md 审核研究结论
  2. 运行 /flow-prd 生成 PRD 文档
  3. 继续后续开发流程
```

---

## Flow-New 命令详解

### 命令格式

```bash
# 完整格式
/flow-new "REQ_ID|TITLE|PLAN_URLS"

# 无 URL 格式
/flow-new "REQ_ID|TITLE"

# 示例
/flow-new "REQ-123|用户认证系统|https://docs.company.com/auth-spec"
/flow-new "REQ-124|数据导出功能"
```

### 执行流程（8个阶段）

```text
🎯 CC-DevFlow 完整需求开发流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/8] /flow-init    → 初始化 + 调研
      ✅ Git 分支创建
      ✅ 目录结构初始化
      ✅ 内部代码调研完成
      ✅ 外部资料抓取完成（6个文件）
      ✅ 研究结论整合（2个决策）

[2/8] /flow-prd     → PRD 生成
      ✅ PRD.md (145行)
      ✅ 5个用户故事 + Given-When-Then 验收标准
      ✅ Constitution 检查通过

[2.5/8] /flow-ui    → UI 原型（条件触发）⚡️
        ✅ 检测到 UI 需求（"页面"、"表单"关键词）
        ✅ 设计灵感采样（3位大师）
        ✅ UI_PROTOTYPE.html（响应式）
        ✅ 设计策略: ui_design_strategy.md

[2.7/8] /flow-tech  → 技术方案设计🔧
        ✅ 代码库技术细化分析
        ✅ TECH_DESIGN.md (180行)
        ✅ 系统架构: React + Express + PostgreSQL + Redis
        ✅ 数据模型: 5个表 + 完整 schema
        ✅ API 设计: 12个端点 + 完整契约
        ✅ 安全方案: JWT + RBAC + 密钥管理
        ✅ Constitution Phase -1 Gates 通过

[3/8] /flow-epic    → Epic 和 Tasks 规划
      ✅ EPIC.md 已生成
      ✅ TASKS.md: 18个任务（基于 TECH_DESIGN 完整覆盖）
         - 数据模型任务: 5个
         - API 任务: 12个
         - 安全任务: 4个
         - 性能任务: 2个
         - 前端任务: 4个（如有）
      ✅ 逻辑独立任务: 8个 [P]

[4/8] /flow-dev     → TDD 开发执行
      🔄 任务进度: 8/18 已完成
      🔄 当前: TASK_009 - 实现用户认证中间件
      🔄 Phase: 实现 JWT 验证逻辑

[5/8] /flow-qa      → 质量保证 + 安全审查
      ⏳ 等待开发完成...

[6/8] /flow-release → 发布管理
      ⏳ 等待 QA 完成...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 阶段详解

#### 阶段 1: 初始化 (/flow-init)
- 解析参数: `REQ_ID|TITLE|PLAN_URLS`
- 创建需求目录结构
- 执行调研工作流（必做）
- 创建 Git 分支
- 更新状态: `status=initialized, phase=planning, phase0_complete=true`

#### 阶段 2: PRD 生成 (/flow-prd)
- `prd-writer` 研究型代理分析需求
- 生成结构化 PRD 文档（100+行）
- 执行 Constitution 检查
- 输出: `PRD.md`

#### 阶段 2.5: UI 原型生成 (/flow-ui) ⚡️ 条件触发

**触发条件**（任一满足）:
- PRD 包含 UI 关键词（"用户界面"、"页面"、"表单"等）
- 项目包含 `package.json`
- 项目包含 `src/components/` 目录

**执行流程**:
1. 检测 UI 需求
2. 智能设计灵感采样（基于 PRD 风格提示）
3. 定义设计系统（色彩/字体/间距/组件）
4. 生成 HTML 原型（单文件 HTML/CSS/JS）
5. Constitution & Quality Check

**输出**:
- `UI_PROTOTYPE.html`（响应式设计，320px/768px/1024px断点）
- `research/ui_design_strategy.md`（设计策略文档）

**跳过条件**:
- PRD 明确标注"纯后端/API项目"
- 无前端技术栈特征
- 用户显式请求跳过 (`--skip-ui`)

#### 阶段 2.7: 技术方案设计 (/flow-tech) 🔧 MANDATORY

**关键价值**:
- 为 planner 提供完整技术上下文
- 确保 TASKS.md 覆盖数据模型/API/安全/性能所有层
- 提供具体技术选型和 API 契约
- 明确数据库 schema，所有表和字段提前定义
- 所有 API 端点提前定义，前后端对接无歧义

**执行流程**:
1. **技术细化分析**（基于 flow-init 的概览分析）
   - 复用: `research/internal/codebase-overview.md`
   - 深度分析: 数据模型/API/认证/数据库/测试模式
   - 输出: `research/codebase-tech-analysis.md`

2. **tech-architect 代理生成 TECH_DESIGN.md**（10个阶段）
   - Phase 1: 加载 PRD 和代码库分析
   - Phase 2: 设计系统架构
   - Phase 3: 选择技术栈（含版本和理由）
   - Phase 4: 定义数据模型（完整表结构+关系+索引）
   - Phase 5: 设计 API 契约（所有端点+请求/响应）
   - Phase 6: 安全方案（认证+授权+密钥管理）
   - Phase 7: 性能方案（缓存+优化+扩展）
   - Phase 8: Phase -1 宪法闸门
   - Phase 9: 验证完整性
   - Phase 10: 生成 TECH_DESIGN.md

**输出**:
- `TECH_DESIGN.md`（150+行完整技术方案）
  - Section 1: 系统架构
  - Section 2: 技术栈（前端/后端/数据库/基础设施）
  - Section 3: 数据模型设计
  - Section 4: API 设计
  - Section 5: 安全设计
  - Section 6: 性能设计
  - Section 7: Constitution 检查
  - Section 8: 验证清单
- `research/codebase-tech-analysis.md`
- `data-model.md`
- `contracts/openapi.yaml`
- `quickstart.md`

#### 阶段 3: Epic 规划 (/flow-epic)
- `planner` 研究型代理分析 `PRD + TECH_DESIGN + research/`
- 分解 Epic 和原子级任务
- 定义依赖关系和 DoD
- 输出: `EPIC.md`, `TASKS.md`（单文件管理所有任务）

**TASKS.md 覆盖 TECH_DESIGN 所有层**:
- 数据模型任务（Section 3: 所有表+迁移+索引）
- API 端点任务（Section 4: 所有端点+验证+错误处理）
- 安全任务（Section 5: 认证+授权+密钥管理+验证）
- 性能任务（Section 6: 缓存+优化+扩展）
- 前端任务（Section 2.1: 组件+状态管理+API集成，如有）

#### 阶段 4: 开发执行 (/flow-dev)
- 串行执行 `TASKS.md` 中的所有任务
- 每个任务遵循 TDD 流程:
  1. 分析现有代码
  2. 编写测试（Tests First）
  3. **TEST VERIFICATION CHECKPOINT**（测试必须先失败）
  4. 实现代码
  5. 测试验证（测试必须通过）
  6. Git 提交并标记完成

**输出**:
- 实现代码
- 测试代码（`*.test.ts` 或 `*.spec.ts`）
- `tasks/TASK_*.completed` 标记文件
- `tasks/IMPLEMENTATION_PLAN.md`
- Git commits（每个任务一个）

#### 阶段 5: 质量保证 (/flow-qa)
- `qa-tester` 代理分析测试覆盖
- 运行完整测试套件
- 检查代码覆盖率（≥80%）
- `security-reviewer` 代理执行安全审查

**Exit Gate 检查**:
- ✅ 所有测试通过
- ✅ 代码覆盖率 ≥ 80%
- ✅ 无高危安全问题
- ✅ TypeScript 类型检查通过

**输出**:
- `TEST_PLAN.md`
- `TEST_REPORT.md`
- `SECURITY_PLAN.md`
- `SECURITY_REPORT.md`

#### 阶段 6: 发布管理 (/flow-release)
- `release-manager` 代理生成发布计划
- **更新 CLAUDE.md 技术架构**（如有重要架构变更）
- 执行最终构建
- 创建 GitHub Pull Request
- 记录 PR URL

**输出**:
- `RELEASE_PLAN.md`
- `CLAUDE.md`（更新技术架构，如有）
- GitHub Pull Request

### 中断与恢复

任何阶段失败或中断:

```bash
# 查看当前状态
/flow-status REQ-123

# 从中断点恢复
/flow-restart "REQ-123"

# 或手动执行特定阶段
/flow-tech "REQ-123"       # 重新生成技术方案
/flow-epic "REQ-123"       # 重新生成 Epic 和 Tasks
/flow-dev "REQ-123" --resume
/flow-qa "REQ-123"
/flow-release "REQ-123"
```

---

## 命令对比

### 功能对比表

| 特性 | /flow-init | /flow-new |
|------|-----------|----------|
| **执行模式** | 单步执行（阶段化） | 全自动执行（包装器） |
| **控制粒度** | 精细控制每个阶段 | 全流程自动化 |
| **调研深度** | 深度调研（必做） | 包含调研（继承自 flow-init） |
| **中间审查** | 支持每阶段审查 | 需手动中断审查 |
| **恢复能力** | 无需恢复（单步） | 支持从中断点恢复 |
| **适用场景** | 复杂项目、逐步推进 | 简单需求、快速开发 |
| **输出产物** | 需求目录 + 调研资料 | 完整开发流程产物 |
| **执行时间** | < 5分钟 | 30分钟 - 数小时 |
| **学习曲线** | 低（单步执行） | 中（需理解全流程） |

### 关系图

```text
┌─────────────────────────────────────────────────────┐
│                   /flow-new                         │
│              （一键完整开发流）                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 1: /flow-init     → 初始化 + 调研     │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 2: /flow-prd      → PRD 生成         │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 2.5: /flow-ui     → UI 原型（条件）  │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 2.7: /flow-tech   → 技术方案（必做） │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 3: /flow-epic     → Epic + Tasks     │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 4: /flow-dev      → TDD 开发         │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 5: /flow-qa       → 质量保证         │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  阶段 6: /flow-release  → 发布管理         │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

单独使用 /flow-init:
  → 只执行阶段 1
  → 后续手动调用其他阶段命令
```

---

## 使用场景建议

### 🟢 适合使用 /flow-init 的场景

1. **复杂项目，需要逐步推进**
   - 需求不完全明确，需要分阶段确认
   - 涉及多个团队协作，需要分阶段交付
   - 有经验的开发者，希望精细控制每个阶段

2. **需要中间审查和调整**
   - 需要在 PRD 阶段与需求方确认
   - 需要在 Epic 阶段调整任务分解
   - 需要在技术方案阶段评审架构决策

3. **学习和理解工作流**
   - 新用户学习 CC-DevFlow 工作流
   - 了解每个阶段的输入输出
   - 理解调研流程的重要性

4. **深度调研需求**
   - 涉及新技术栈，需要深度调研
   - 需要集成第三方服务，需要外部资料
   - 需要技术选型决策，需要对比分析

**示例**:
```bash
# 第一天: 初始化和调研
/flow-init "REQ-123|支付系统集成"
# 审查 research/ 目录下的调研资料

# 第二天: 生成 PRD 并审查
/flow-prd "REQ-123"
# 与需求方确认 PRD.md

# 第三天: 技术方案设计
/flow-tech "REQ-123"
# 团队评审技术方案

# 第四天: 任务规划
/flow-epic "REQ-123"
# 确认任务分解和优先级

# 第五天起: 开发执行
/flow-dev "REQ-123"
```

### 🔵 适合使用 /flow-new 的场景

1. **简单明确的需求**
   - 需求清晰，不需要中间干预
   - 熟悉的需求类型和技术栈
   - 内部工具或辅助功能开发

2. **快速原型开发**
   - 需要快速验证想法
   - 演示用途的原型
   - 概念验证（PoC）项目

3. **演示和学习 CC-DevFlow**
   - 向他人演示完整工作流
   - 学习端到端流程
   - 了解各阶段的衔接

4. **标准化开发流程**
   - 团队已有标准模板
   - 重复性的需求类型
   - 自动化 CI/CD 集成

**示例**:
```bash
# 一键执行完整流程
/flow-new "REQ-124|用户导出Excel功能|https://docs.company.com/export-spec"

# 系统自动完成:
# ✅ 初始化 + 调研
# ✅ PRD 生成
# ✅ UI 原型（条件触发）
# ✅ 技术方案设计
# ✅ Epic + Tasks 规划
# ✅ TDD 开发执行
# ✅ 质量保证 + 安全审查
# ✅ 发布管理 + PR 创建
```

### ⚠️ 混合使用建议

对于**中等复杂度项目**，推荐混合使用:

```bash
# 1. 使用 flow-init 进行初始化和调研
/flow-init "REQ-125|订单管理系统"

# 2. 审查调研资料，补充说明
# 编辑 research/research.md

# 3. 手动执行后续阶段（可逐步审查）
/flow-prd "REQ-125"      # 生成 PRD，审查
/flow-tech "REQ-125"     # 技术方案，团队评审
/flow-epic "REQ-125"     # 任务规划，确认优先级

# 4. 使用 flow-dev 自动化开发执行
/flow-dev "REQ-125"      # TDD 开发（自动化）

# 5. QA 和发布
/flow-qa "REQ-125"
/flow-release "REQ-125"
```

---

## 实际使用示例

### 示例 1: 使用 flow-init 初始化新需求

**场景**: 开发一个微信小程序的用户认证功能

```bash
# Step 1: 初始化需求
/flow-init "REQ-001|小程序用户认证"

# 系统输出:
✅ Requirement structure initialized successfully!

Requirement ID:    REQ-001
Type:              requirement
Directory:         devflow/requirements/REQ-001
Title:             小程序用户认证
Git Branch:        feature/REQ-001-小程序用户认证

调研完成:
  - 内部代码调研: research/internal/codebase-overview.md
  - 外部资料抓取: 8 个文件
    • 官方文档: research/mcp/official/wechat-miniprogram-docs.md
    • 教程资源: research/mcp/guides/resources.md
    • 代码示例: research/mcp/examples/auth-example.md
  - 研究任务: 4 个已完成
  - 研究结论: research/research.md (3 个决策)

Next Steps:
  1. 查看 research/research.md 审核研究结论
  2. 运行 /flow-prd 生成 PRD 文档
  3. 继续后续开发流程

# Step 2: 审查调研资料
# 打开 devflow/requirements/REQ-001/research/research.md

# Step 3: 继续执行后续阶段
/flow-prd "REQ-001"
```

**生成的目录结构**:

```text
devflow/requirements/REQ-001/
├── research/
│   ├── internal/
│   │   └── codebase-overview.md          # 内部代码分析
│   ├── mcp/
│   │   └── 20251121/
│   │       ├── official/
│   │       │   └── wechat-miniprogram-docs.md
│   │       ├── guides/
│   │       │   └── resources.md
│   │       ├── tutorials/
│   │       │   └── wechat-auth-tutorial.md
│   │       └── examples/
│   │           └── auth-example.md
│   ├── tasks.json                        # 研究任务追踪
│   ├── research-summary.md               # 调研摘要
│   └── research.md                       # 研究结论（标准格式）
├── README.md
├── EXECUTION_LOG.md
└── orchestration_status.json
```

**research.md 内容示例**:

```markdown
# Research Summary for REQ-001

**Feature**: 小程序用户认证
**Generated**: 2025-11-21T06:30:00Z

## Research Summary

完成了微信小程序认证方案的深度调研，涵盖官方文档、最佳实践和实际案例。

## Decisions

### R001 — 认证流程选择
- **Decision**: 使用微信 `wx.login()` + 自建后端 Session 的混合认证方案
- **Rationale**:
  - 微信官方推荐方案，安全性有保障
  - 支持自定义用户体系和权限管理
  - 可扩展支持其他第三方登录
- **Alternatives considered**:
  - 纯微信授权（无后端）: 功能受限，无法自定义权限
  - OAuth 2.0: 微信小程序不支持标准 OAuth 流程

### R002 — Session 存储方案
- **Decision**: 使用 Redis 存储 Session
- **Rationale**:
  - 高性能，支持过期时间设置
  - 支持分布式部署
  - 项目已有 Redis 基础设施
- **Alternatives considered**:
  - JWT: 无法主动撤销，不适合敏感操作
  - 数据库存储: 性能较低，增加数据库负担

### R003 — 敏感信息加密
- **Decision**: 使用 AES-256-GCM 加密用户敏感信息
- **Rationale**:
  - 行业标准加密算法
  - 支持认证加密（AEAD）
  - Node.js crypto 原生支持
- **Alternatives considered**:
  - RSA: 性能较低，适合密钥交换
  - AES-CBC: 无认证机制，易受攻击

## Source Library

### 官方文档
- [微信小程序登录文档](research/mcp/official/wechat-miniprogram-docs.md)

### 教程和指南
- [微信小程序认证最佳实践](research/mcp/tutorials/wechat-auth-tutorial.md)

### 代码示例
- [认证流程示例代码](research/mcp/examples/auth-example.md)

## Validation Status

✅ All required sections present
✅ All decisions have Decision/Rationale/Alternatives
✅ No TODO markers
✅ No placeholder text
```

---

### 示例 2: 使用 flow-new 快速开发

**场景**: 开发一个简单的数据导出功能

```bash
# 一键执行完整流程
/flow-new "REQ-002|订单数据导出Excel|https://docs.company.com/export-spec"

# 系统自动执行所有阶段（带进度显示）
🎯 CC-DevFlow 完整需求开发流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需求: REQ-002 | 订单数据导出Excel

[1/8] ✅ 初始化完成
      → Git分支: feature/REQ-002-订单数据导出excel
      → 需求目录已创建
      → 研究材料已抓取: 5 个文件

[2/8] ✅ PRD生成完成
      → PRD.md: 98 行
      → 用户故事: 3 个
      → Constitution检查: 通过

[2.5/8] ⏭️  UI原型生成跳过
        → 检测结果: 纯后端功能，无UI需求
        → 记录: "No UI requirements detected, skipping /flow-ui"

[2.7/8] ✅ 技术方案设计完成
        → TECH_DESIGN.md: 156 行
        → 系统架构: Express + PostgreSQL
        → 数据模型: 2 个表 (orders, export_logs)
        → API 设计: 3 个端点
        → 安全方案: JWT + 导出权限验证
        → Constitution检查: 通过

[3/8] ✅ Epic规划完成
      → EPIC.md 已生成
      → TASKS.md: 12 个任务
      → 逻辑独立任务: 5 个 [P]

[4/8] ✅ 开发执行完成
      → 任务进度: 12/12 已完成
      → Git commits: 12 个
      → 代码文件: 8 个新增, 3 个修改

[5/8] ✅ 质量保证完成
      → 测试通过: 35/35
      → 代码覆盖率: 87.5%
      → 安全扫描: 无高危问题

[6/8] ✅ 发布管理完成
      → PR 创建成功: #42
      → PR URL: https://github.com/company/project/pull/42

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 需求开发完成！

📋 产物清单:
  - PRD.md
  - TECH_DESIGN.md
  - EPIC.md
  - TASKS.md (12个任务)
  - 实现代码 (11个文件)
  - 测试代码 (8个文件)
  - TEST_REPORT.md
  - SECURITY_REPORT.md
  - RELEASE_PLAN.md

🔗 Pull Request: https://github.com/company/project/pull/42

Next Steps:
  1. 审查 PR 并请求代码审查
  2. 等待 CI/CD 通过
  3. 合并到 main 分支
  4. 部署到生产环境
```

**时间估算**:
- flow-init: 3-5 分钟
- flow-prd: 2-3 分钟
- flow-tech: 3-4 分钟
- flow-epic: 2-3 分钟
- flow-dev: 15-30 分钟（取决于任务数量）
- flow-qa: 3-5 分钟
- flow-release: 2-3 分钟

**总计**: 约 30-50 分钟（全自动执行）

---

### 示例 3: 中断恢复场景

**场景**: flow-new 在开发阶段失败，需要恢复

```bash
# 初始命令
/flow-new "REQ-003|支付系统集成"

# 假设在阶段 4 (开发执行) 失败:
[4/8] ❌ 开发执行失败
      → 错误: TASK_008 测试验证失败
      → 失败原因: 支付回调接口未正确mock

# Step 1: 查看当前状态
/flow-status REQ-003

# 输出:
Requirement: REQ-003 | 支付系统集成
Status: dev_in_progress
Phase: development
Last Updated: 2025-11-21 08:45:23

Completed Stages:
  ✅ [1] Initialize     - 2025-11-21 08:30:00
  ✅ [2] PRD           - 2025-11-21 08:33:15
  ✅ [2.7] Tech Design - 2025-11-21 08:37:42
  ✅ [3] Epic          - 2025-11-21 08:40:28
  🔄 [4] Development   - In Progress (7/15 tasks)
  ⏳ [5] QA            - Not Started
  ⏳ [6] Release       - Not Started

Current Task: TASK_008 - 实现支付回调接口
Failure Reason: 测试验证失败 - 支付回调未正确mock

# Step 2: 手动修复问题
# 编辑测试文件，添加正确的 mock

# Step 3: 从失败点恢复
/flow-dev "REQ-003" --resume

# 系统输出:
🔄 恢复开发执行...

检测到已完成任务: 7/15
从 TASK_008 继续执行...

[TASK_008] 实现支付回调接口
  Phase 2: 测试验证...
  ✅ 测试通过 (5/5)

[TASK_009] 实现支付结果查询...
  ...

# 继续执行后续阶段
/flow-qa "REQ-003"
/flow-release "REQ-003"
```

---

## 执行流程详解

### Flow-Init 详细流程图

```text
┌─────────────────────────────────────────────────────┐
│            /flow-init 执行流程                      │
└─────────────────────────────────────────────────────┘

🔹 阶段 1: 参数解析和验证 (Entry Gate)
   │
   ├─ 解析参数: REQ_ID|TITLE
   ├─ 验证格式: ^(REQ|BUG)-[0-9]+$
   ├─ 检查冲突: ls devflow/requirements/${REQ_ID}
   └─ 验证 Git: git status --porcelain
   │
   ✅ Gate Check: 所有验证通过
   │
   ▼

🔹 阶段 1.5: 路线图与架构上下文加载
   │
   ├─ 检查 ROADMAP.md 是否存在
   │  └─ 若存在: 定位需求在路线图中的位置
   │     • RM-ID, Milestone, Quarter, Cluster
   │
   ├─ 检查 ARCHITECTURE.md 是否存在
   │  └─ 若存在: 加载架构上下文
   │     • Feature Architecture
   │     • Technical Architecture
   │     • Module Structure
   │     • Requirement Dependencies
   │
   └─ 汇总上下文信息
      └─ 传递给后续阶段
   │
   ▼

🔹 阶段 2: 目录初始化与基线文件落地
   │
   ├─ 执行脚本: create-requirement.sh "${REQ_ID}" --title "${TITLE}"
   │  │
   │  ├─ 创建目录: devflow/requirements/${REQ_ID}/
   │  ├─ 创建目录: devflow/requirements/${REQ_ID}/research/
   │  ├─ 创建文件: README.md
   │  ├─ 创建文件: EXECUTION_LOG.md
   │  └─ 创建文件: orchestration_status.json
   │
   └─ 记录初始化事件到 EXECUTION_LOG.md
   │
   ▼

🔹 阶段 2.5: 代码与外部调研（MCP 强制流程）
   │
   🧭 Step 0: 现有代码调研（必做）
   │  ├─ 运行: check-prerequisites.sh --json
   │  ├─ 浏览: README, ARCHITECTURE 文档
   │  ├─ 梳理: 可复用模块、核心接口、测试集
   │  └─ 输出: research/internal/codebase-overview.md
   │
   📦 Step 1: 获取官方文档 (Context7 MCP)
   │  ├─ 调用: resolve-library-id("<关键词>")
   │  ├─ 调用: get-library-docs(library_id, tokens=5000)
   │  └─ 保存: research/mcp/official/${library_id}-docs.md
   │
   🔍 Step 2: 搜索领域教程 (Web Search)
   │  ├─ 搜索: "<主题> tutorial site:<权威域名>"
   │  └─ 保存: research/mcp/guides/resources.md
   │
   📥 Step 3: 下载核心资料 (WebFetch)
   │  ├─ 抓取 2-3 篇高价值文章
   │  └─ 保存: research/mcp/tutorials/${slug}.md
   │
   💡 Step 4: 搜集实践案例 (Web Search + WebFetch)
   │  ├─ 搜索: "<能力> example site:github.com"
   │  └─ 保存: research/mcp/examples/${slug}.md
   │
   📝 Step 5: 生成调研摘要
   │  └─ 创建: research/research-summary.md
   │
   ▼

🔹 阶段 2.6: 调研任务分派与决策整合
   │
   ├─ 1. 生成研究任务
   │  └─ 运行: generate-research-tasks.sh "${REQ_DIR}"
   │     └─ 输出: research/tasks.json
   │
   ├─ 2. 填充研究决策
   │  └─ 运行: populate-research-tasks.sh "${REQ_DIR}"
   │     └─ 从 research-summary.md 提取决策
   │     └─ 填充 tasks.json 的 decision/rationale/alternatives
   │
   ├─ 3. 整合研究结论
   │  └─ 运行: consolidate-research.sh "${REQ_DIR}"
   │     └─ 输出: research/research.md (标准格式)
   │
   └─ 4. 更新状态
      └─ orchestration_status.json.phase0_complete = true
   │
   ▼

🔹 阶段 3: Git 分支创建 (if git repo)
   │
   ├─ 生成分支名
   │  ├─ REQ-XXX: feature/${REQ_ID}-${slug(TITLE)}
   │  └─ BUG-XXX: bugfix/${REQ_ID}-${slug(TITLE)}
   │
   ├─ 检查分支是否存在: git rev-parse --verify ${BRANCH_NAME}
   ├─ 创建并切换: git checkout -b "${BRANCH_NAME}"
   ├─ 设置环境变量: export DEVFLOW_REQ_ID="${REQ_ID}"
   └─ 记录到日志: EXECUTION_LOG.md
   │
   ▼

🔹 阶段 4: README 生成
   │
   ├─ 生成 README.md
   │  ├─ Requirement ID 和 Title
   │  ├─ 文档清单 (PRD, EPIC, TASKS, etc.)
   │  ├─ 工作流阶段
   │  ├─ 研究材料位置
   │  └─ 下一步指引
   │
   └─ 保存到: REQ_DIR/README.md
   │
   ▼

🔹 阶段 5: 完成确认 (Exit Gate)
   │
   ✅ LEVEL 1: 文件存在性检查
   │  ├─ REQ_DIR/ 目录存在
   │  ├─ research/ 目录存在
   │  ├─ research/internal/ 目录存在
   │  ├─ README.md 存在
   │  ├─ EXECUTION_LOG.md 存在
   │  ├─ orchestration_status.json 存在
   │  ├─ research/research.md 存在
   │  └─ research/tasks.json 存在
   │
   ✅ LEVEL 2: research.md 结构验证
   │  ├─ 运行: validate-research.sh "${REQ_DIR}"
   │  ├─ "## Research Summary" 存在
   │  ├─ "## Decisions" 存在
   │  ├─ 至少 1 个 "### R00X —" 决策块
   │  └─ "## Source Library" 存在
   │
   ✅ LEVEL 3: research.md 内容质量
   │  ├─ 无 TODO 标记
   │  ├─ 无 {{PLACEHOLDER}}
   │  └─ 每个决策有 Decision/Rationale/Alternatives
   │
   ✅ LEVEL 4: 研究任务验证
   │  ├─ research/tasks.json 为有效 JSON
   │  ├─ 包含 "tasks" 数组
   │  └─ 至少 1 个任务状态 != "open"
   │
   ✅ LEVEL 5: Git/状态/Constitution
   │  ├─ Git 分支创建成功
   │  ├─ orchestration_status.json 状态正确
   │  ├─ EXECUTION_LOG.md 包含所有记录
   │  └─ Constitution Article X 合规
   │
   ▼

✅ 初始化完成
   └─ 输出成功信息和下一步指引
```

---

### Flow-New 详细流程图

```text
┌─────────────────────────────────────────────────────┐
│            /flow-new 执行流程                       │
│         (8个阶段顺序执行)                           │
└─────────────────────────────────────────────────────┘

📥 解析参数: REQ_ID|TITLE|PLAN_URLS
   │
   ▼

[1/8] 🔹 调用: /flow-init "REQ_ID|TITLE"
      │
      ├─ 目录结构初始化
      ├─ 深度调研工作流
      ├─ 研究任务管理
      ├─ Git 分支创建
      └─ 状态初始化
      │
      ✅ 输出: 需求目录 + 调研资料
      │
      ▼

[2/8] 🔹 调用: /flow-prd "REQ_ID"
      │
      ├─ prd-writer 研究型代理分析需求
      ├─ 生成结构化 PRD 文档
      ├─ 执行 Constitution 检查
      └─ 验证文档完整性
      │
      ✅ 输出: PRD.md (100+ 行)
      │
      ▼

[2.5/8] 🔹 条件判断: 是否需要 UI 原型?
        │
        ├─ 检测 UI 需求
        │  ├─ PRD 包含 UI 关键词?
        │  ├─ 项目包含 package.json?
        │  └─ 项目包含 src/components/?
        │
        ├─ 若需要 UI: 调用 /flow-ui "REQ_ID"
        │  │
        │  ├─ ui-designer 研究型代理执行
        │  ├─ 智能设计灵感采样
        │  ├─ 定义设计系统
        │  ├─ 生成 HTML 原型
        │  └─ Constitution & Quality Check
        │  │
        │  ✅ 输出: UI_PROTOTYPE.html + ui_design_strategy.md
        │
        └─ 若无需 UI: 跳过此阶段
           └─ 记录: "No UI requirements detected, skipping /flow-ui"
        │
        ▼

[2.7/8] 🔹 调用: /flow-tech "REQ_ID" (MANDATORY)
        │
        ├─ 技术细化分析
        │  ├─ 复用: research/internal/codebase-overview.md
        │  ├─ 深度分析: 数据模型/API/认证/数据库/测试
        │  └─ 输出: research/codebase-tech-analysis.md
        │
        ├─ tech-architect 研究型代理执行 (10个阶段)
        │  ├─ Phase 1: 加载 PRD 和代码库分析
        │  ├─ Phase 2: 设计系统架构
        │  ├─ Phase 3: 选择技术栈（版本+理由）
        │  ├─ Phase 4: 定义数据模型（表+关系+索引）
        │  ├─ Phase 5: 设计 API 契约（端点+请求/响应）
        │  ├─ Phase 6: 安全方案（认证+授权+密钥）
        │  ├─ Phase 7: 性能方案（缓存+优化+扩展）
        │  ├─ Phase 8: Phase -1 宪法闸门
        │  ├─ Phase 9: 验证完整性
        │  └─ Phase 10: 生成 TECH_DESIGN.md
        │
        └─ 验证技术方案完整性
        │
        ✅ 输出: TECH_DESIGN.md + data-model.md + contracts/openapi.yaml + quickstart.md
        │
        ▼

[3/8] 🔹 调用: /flow-epic "REQ_ID"
      │
      ├─ planner 研究型代理分析 PRD + TECH_DESIGN + research/
      ├─ 分解 Epic 和原子级任务
      ├─ 定义依赖关系和 DoD
      └─ 标记逻辑独立任务 [P]
      │
      ✅ 输出: EPIC.md + TASKS.md
      │       (TASKS 覆盖 TECH_DESIGN 所有层)
      │
      ▼

[4/8] 🔹 调用: /flow-dev "REQ_ID"
      │
      ├─ 串行执行 TASKS.md 中的所有任务
      │
      └─ 对每个任务:
         │
         ├─ Phase 1: 分析现有代码
         ├─ Phase 2: 编写测试 (Tests First)
         ├─ TEST VERIFICATION CHECKPOINT (测试必须先失败)
         ├─ Phase 3: 实现代码
         ├─ Phase 4: 测试验证 (测试必须通过)
         └─ Phase 5: Git 提交并标记完成
      │
      ✅ 输出: 实现代码 + 测试代码 + tasks/*.completed + Git commits
      │
      ▼

[5/8] 🔹 调用: /flow-qa "REQ_ID" --full
      │
      ├─ qa-tester 代理分析测试覆盖
      ├─ 运行完整测试套件
      ├─ 检查代码覆盖率 (≥80%)
      ├─ security-reviewer 代理执行安全审查
      └─ 生成测试和安全报告
      │
      ├─ Exit Gate 检查:
      │  ├─ ✅ 所有测试通过
      │  ├─ ✅ 代码覆盖率 ≥ 80%
      │  ├─ ✅ 无高危安全问题
      │  └─ ✅ TypeScript 类型检查通过
      │
      ✅ 输出: TEST_PLAN.md + TEST_REPORT.md + SECURITY_PLAN.md + SECURITY_REPORT.md
      │
      ▼

[6/8] 🔹 调用: /flow-release "REQ_ID"
      │
      ├─ release-manager 代理生成发布计划
      ├─ 更新 CLAUDE.md 技术架构 (如有重要架构变更)
      ├─ 执行最终构建
      ├─ 创建 GitHub Pull Request
      └─ 记录 PR URL
      │
      ✅ 输出: RELEASE_PLAN.md + CLAUDE.md (更新) + GitHub PR
      │
      ▼

✅ 完整流程执行完毕
   │
   └─ 输出: 成功摘要 + PR 链接 + 下一步建议
```

---

## 常见问题解答

### Q1: flow-init 和 flow-new 可以同时使用吗?

**A**: 不能。它们是互斥的。

- **选择 flow-init**: 逐步执行，每个阶段手动调用
- **选择 flow-new**: 全自动执行，一次性完成所有阶段

如果你已经运行了 `/flow-init`，后续应该手动调用其他阶段命令（`/flow-prd`, `/flow-tech`, 等），而不是再运行 `/flow-new`。

---

### Q2: flow-new 执行到一半失败，如何恢复?

**A**: 使用 `/flow-restart` 或手动执行后续阶段。

```bash
# 方法 1: 自动恢复
/flow-restart "REQ-123"

# 方法 2: 手动执行特定阶段
/flow-status REQ-123          # 查看当前状态
/flow-dev "REQ-123" --resume  # 从失败阶段继续
```

---

### Q3: 调研资料抓取失败怎么办?

**A**: flow-init 的调研流程失败不会阻止初始化完成。

- 系统会在 `research/research-summary.md` 中标注待补项
- 你可以手动补充调研资料到 `research/` 目录
- 后续 `/flow-prd` 会读取 `research/` 目录下的所有资料

**手动补充示例**:

```bash
# 1. 手动下载文档
curl https://docs.example.com/api-spec.md -o devflow/requirements/REQ-123/research/api-spec.md

# 2. 更新 research-summary.md
echo "- [API 规范](research/api-spec.md)" >> devflow/requirements/REQ-123/research/research-summary.md

# 3. 继续执行后续阶段
/flow-prd "REQ-123"
```

---

### Q4: 如何跳过 UI 原型生成阶段?

**A**: UI 原型生成是条件触发的，可通过以下方式跳过:

1. **在 PRD 中明确标注**:
   ```markdown
   ## 项目类型
   **纯后端/API 项目，无 UI 需求**
   ```

2. **使用命令行参数**（如果单独调用）:
   ```bash
   /flow-ui "REQ-123" --skip
   ```

3. **检测逻辑自动跳过**:
   - 如果 PRD 无 UI 关键词
   - 且项目无前端技术栈特征
   - 则自动跳过

---

### Q5: flow-init 的调研资料保存在哪里?

**A**: 所有调研资料保存在 `devflow/requirements/${REQ_ID}/research/` 目录下:

```text
research/
├── internal/                # 内部代码库分析
│   └── codebase-overview.md
├── mcp/                     # 外部资料（MCP 抓取）
│   └── 20251121/            # 按日期组织
│       ├── official/        # 官方文档
│       ├── guides/          # 教程资源
│       ├── tutorials/       # 详细教程
│       └── examples/        # 代码示例
├── tasks.json               # 研究任务追踪
├── research-summary.md      # 调研摘要
└── research.md              # 研究结论（标准格式）
```

所有远程抓取的原始资料以 `.md` 文件原样保存，任何摘要在 `research-summary.md` 中编写。

---

### Q6: 如何查看当前需求的开发状态?

**A**: 使用 `/flow-status` 命令。

```bash
/flow-status REQ-123

# 输出:
Requirement: REQ-123 | 用户认证系统
Status: dev_in_progress
Phase: development
Last Updated: 2025-11-21 08:45:23

Completed Stages:
  ✅ [1] Initialize     - 2025-11-21 08:30:00
  ✅ [2] PRD           - 2025-11-21 08:33:15
  ✅ [2.7] Tech Design - 2025-11-21 08:37:42
  ✅ [3] Epic          - 2025-11-21 08:40:28
  🔄 [4] Development   - In Progress (7/15 tasks)
  ⏳ [5] QA            - Not Started
  ⏳ [6] Release       - Not Started

Current Task: TASK_008 - 实现支付回调接口
```

---

### Q7: 可以修改已生成的 PRD 或 TASKS 吗?

**A**: 可以，但有注意事项。

**修改 PRD**:
```bash
# 1. 手动编辑 PRD.md
vim devflow/requirements/REQ-123/PRD.md

# 2. 如果需要重新生成 TASKS，删除旧的并重新运行
rm devflow/requirements/REQ-123/TASKS.md
/flow-epic "REQ-123"
```

**修改 TASKS**:
```bash
# 1. 手动编辑 TASKS.md
vim devflow/requirements/REQ-123/TASKS.md

# 2. 如果已开始开发，需要更新状态
# 删除已完成的 .completed 标记（如需重做）
rm devflow/requirements/REQ-123/tasks/TASK_005.completed

# 3. 继续开发
/flow-dev "REQ-123" --resume
```

**重要**: 修改文档后，记录到 `EXECUTION_LOG.md`:
```bash
bash .claude/scripts/log-event.sh REQ-123 "Manual edit: Updated PRD.md - changed authentication flow"
```

---

### Q8: flow-new 需要多长时间执行完成?

**A**: 执行时间取决于项目复杂度和任务数量。

**典型时间估算**:

| 项目类型 | 任务数量 | 估算时间 |
|---------|---------|---------|
| 简单功能（如数据导出） | 8-12 个任务 | 30-50 分钟 |
| 中等功能（如用户认证） | 15-25 个任务 | 1-2 小时 |
| 复杂功能（如支付系统） | 30-50 个任务 | 3-5 小时 |

**各阶段时间占比**:
- 初始化 + 调研: 10%
- PRD + 技术方案: 15%
- Epic + Tasks 规划: 10%
- **开发执行: 50-60%** (最耗时)
- QA + 安全审查: 10%
- 发布管理: 5%

---

### Q9: 如何并行执行多个需求?

**A**: 每个需求独立运行在自己的 Git 分支上，可以并行开发。

```bash
# 终端 1: 开发需求 1
/flow-new "REQ-123|用户认证"

# 终端 2: 开发需求 2
/flow-new "REQ-124|数据导出"

# 终端 3: 开发需求 3
/flow-new "REQ-125|支付集成"
```

**注意**:
- 每个需求在独立的 Git 分支上
- 每个需求有独立的目录结构
- 避免修改共享文件导致冲突

---

### Q10: flow-init 的 Exit Gate 检查失败怎么办?

**A**: 根据失败的 LEVEL 采取不同的修复措施。

**LEVEL 1 失败**（文件缺失）:
```bash
# 重新运行 flow-init
/flow-init "REQ-123|标题" --force
```

**LEVEL 2 失败**（research.md 结构无效）:
```bash
# 手动修复 research.md 结构
vim devflow/requirements/REQ-123/research/research.md

# 确保包含必需章节:
# ## Research Summary
# ## Decisions
# ### R001 — ...
# ## Source Library

# 重新验证
bash .claude/scripts/validate-research.sh devflow/requirements/REQ-123
```

**LEVEL 3 失败**（内容质量问题）:
```bash
# 检查 TODO 标记
grep -r "TODO" devflow/requirements/REQ-123/research/research.md

# 手动填充 Decision/Rationale/Alternatives
vim devflow/requirements/REQ-123/research/research.md
```

**LEVEL 4 失败**（研究任务无效）:
```bash
# 重新生成研究任务
bash .claude/scripts/generate-research-tasks.sh devflow/requirements/REQ-123

# 填充决策信息
bash .claude/scripts/populate-research-tasks.sh devflow/requirements/REQ-123

# 整合研究结论
bash .claude/scripts/consolidate-research.sh devflow/requirements/REQ-123
```

**LEVEL 5 失败**（Git/状态/Constitution 问题）:
```bash
# 检查 Git 分支
git branch --list "feature/REQ-123-*"

# 检查状态文件
cat devflow/requirements/REQ-123/orchestration_status.json | jq .

# 检查执行日志
tail -n 20 devflow/requirements/REQ-123/EXECUTION_LOG.md
```

---

## 最佳实践

### 1️⃣ 需求准备

**使用 flow-init 前**:
```text
✅ 确保需求标题清晰明确
✅ 准备好外部资料 URL（如有）
✅ 确认 Git 工作区干净（git status）
✅ 在 main/develop 分支上执行
```

**使用 flow-new 前**:
```text
✅ 需求足够简单明确
✅ 不需要中间审查
✅ 熟悉的技术栈
✅ 预留足够的执行时间（1-5小时）
```

---

### 2️⃣ 调研资料管理

**组织结构**:
```text
research/
├── internal/                # 内部代码库分析（只读，由系统生成）
├── mcp/                     # 外部资料（只读，由 MCP 抓取）
├── manual/                  # 手动添加的资料（可编辑）
│   ├── designs/             # 设计文档
│   ├── specs/               # 规范文档
│   └── references/          # 参考资料
├── tasks.json               # 研究任务（系统生成）
├── research-summary.md      # 调研摘要（可编辑）
└── research.md              # 研究结论（系统生成，基于 tasks.json）
```

**最佳实践**:
- ✅ 手动添加的资料放在 `manual/` 子目录
- ✅ 不要修改 `mcp/` 和 `internal/` 目录下的文件
- ✅ 在 `research-summary.md` 中编写摘要和批注
- ✅ 使用 `research.md` 的标准格式记录决策

---

### 3️⃣ 阶段化执行策略

**推荐流程**（适合中等复杂度项目）:

```bash
# Day 1: 初始化 + 调研
/flow-init "REQ-123|功能标题"
# → 审查 research/ 目录
# → 补充必要的手动资料

# Day 2: PRD 生成 + 审查
/flow-prd "REQ-123"
# → 与需求方确认 PRD.md
# → 必要时手动修改

# Day 3: 技术方案设计 + 评审
/flow-tech "REQ-123"
# → 团队评审 TECH_DESIGN.md
# → 确认技术选型和架构

# Day 4: 任务规划 + 确认
/flow-epic "REQ-123"
# → 审查 TASKS.md
# → 调整任务优先级和依赖

# Day 5-10: 开发执行
/flow-dev "REQ-123"
# → 自动化 TDD 开发
# → 每天审查进度

# Day 11: 质量保证
/flow-qa "REQ-123"
# → 审查测试报告和安全报告
# → 修复发现的问题

# Day 12: 发布管理
/flow-release "REQ-123"
# → 审查 PR
# → 合并到主分支
```

---

### 4️⃣ 质量检查清单

**在每个阶段完成后检查**:

**✅ flow-init 完成后**:
```text
□ research/research.md 包含至少 2 个决策
□ 所有决策有 Decision/Rationale/Alternatives
□ 无 TODO 或 PLACEHOLDER 标记
□ Git 分支创建成功
□ orchestration_status.json.phase0_complete = true
```

**✅ flow-prd 完成后**:
```text
□ PRD.md 包含至少 3 个用户故事
□ 每个用户故事有 Given-When-Then 验收标准
□ 非功能性需求明确定义
□ Constitution 检查通过
□ 无 [NEEDS CLARIFICATION] 标记（或已记录）
```

**✅ flow-tech 完成后**:
```text
□ TECH_DESIGN.md 包含完整的系统架构
□ 所有技术选型有版本号和理由
□ 数据模型完整（所有表、字段、关系、索引）
□ API 设计完整（所有端点、请求/响应 schema）
□ 安全方案完整（认证、授权、密钥管理）
□ 性能方案完整（缓存、优化、扩展）
□ Phase -1 宪法闸门通过
```

**✅ flow-epic 完成后**:
```text
□ TASKS.md 覆盖 TECH_DESIGN 所有层
□ 每个任务有明确的 DoD（Definition of Done）
□ 任务依赖关系清晰，无循环依赖
□ 逻辑独立任务标记 [P]
□ 任务粒度合理（1-3 天完成）
```

**✅ flow-dev 完成后**:
```text
□ 所有任务标记为完成（tasks/*.completed）
□ 每个任务有对应的 Git commit
□ 所有测试通过
□ TypeScript 类型检查通过
□ 无 lint 错误
```

**✅ flow-qa 完成后**:
```text
□ 代码覆盖率 ≥ 80%
□ 所有测试通过
□ 无高危安全问题
□ TEST_REPORT.md 包含详细结果
□ SECURITY_REPORT.md 包含扫描结果
```

**✅ flow-release 完成后**:
```text
□ PR 创建成功
□ PR 描述完整（包含 PRD、测试报告、安全报告）
□ CLAUDE.md 已更新（如有架构变更）
□ 最终构建成功
□ RELEASE_PLAN.md 包含回滚策略
```

---

### 5️⃣ 错误处理和调试

**启用调试日志**:
```bash
export FLOW_DEBUG=1
/flow-new "REQ-123|测试需求"
```

**查看详细日志**:
```bash
# 查看执行日志
cat devflow/requirements/REQ-123/EXECUTION_LOG.md

# 查看状态文件
cat devflow/requirements/REQ-123/orchestration_status.json | jq .

# 查看研究任务
cat devflow/requirements/REQ-123/research/tasks.json | jq .

# 查看错误日志（如果存在）
cat .claude/logs/flow-REQ-123.log
```

**常见错误和解决方案**:

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `REQ_ID already exists` | 需求目录已存在 | 使用 `/flow-restart` 或选择新的 REQ_ID |
| `Git branch conflict` | 分支已存在 | 删除旧分支或使用 `--skip-git` |
| `research.md validation failed` | 调研结论不完整 | 手动填充 `research/research.md` |
| `TEST VERIFICATION failed` | 测试直接通过 | 修复测试使其能正确捕获错误 |
| `Code coverage below 80%` | 测试覆盖率不足 | 补充测试用例 |
| `Security scan failed` | 发现安全问题 | 修复代码中的安全漏洞 |

---

### 6️⃣ 团队协作建议

**多人协作流程**:

```text
┌─────────────────────────────────────────────────┐
│              团队协作工作流                      │
└─────────────────────────────────────────────────┘

👤 需求分析师:
   └─ 运行: /flow-init "REQ-123|功能标题"
      └─ 输出: 需求目录 + 调研资料
         └─ 提交 Git commit

👤 产品经理:
   └─ 运行: /flow-prd "REQ-123"
      └─ 审查并修改 PRD.md
         └─ 提交 Git commit

👤 架构师:
   └─ 运行: /flow-tech "REQ-123"
      └─ 审查并修改 TECH_DESIGN.md
         └─ 团队评审
            └─ 提交 Git commit

👤 项目经理:
   └─ 运行: /flow-epic "REQ-123"
      └─ 审查并调整 TASKS.md
         └─ 分配任务给开发者
            └─ 提交 Git commit

👤 开发者:
   └─ 运行: /flow-dev "REQ-123"
      └─ 自动化 TDD 开发
         └─ 每个任务一个 Git commit

👤 QA 工程师:
   └─ 运行: /flow-qa "REQ-123"
      └─ 审查测试报告和安全报告
         └─ 提交 Git commit

👤 发布经理:
   └─ 运行: /flow-release "REQ-123"
      └─ 创建 PR 并合并
         └─ 部署到生产环境
```

---

### 7️⃣ 性能优化建议

**加速 flow-new 执行**:

1. **并行执行独立任务**（TASKS.md 中标记 `[P]` 的任务）:
   ```bash
   /flow-dev "REQ-123" --parallel
   ```

2. **跳过非必要阶段**:
   ```bash
   # 纯后端项目，跳过 UI 原型
   /flow-new "REQ-123|API开发" --skip-ui
   ```

3. **使用缓存的调研资料**（如果类似需求已存在）:
   ```bash
   # 复制现有调研资料
   cp -r devflow/requirements/REQ-100/research/ devflow/requirements/REQ-123/research/

   # 继续执行后续阶段
   /flow-prd "REQ-123"
   ```

4. **减少 MCP 抓取数量**（修改配置）:
   ```bash
   # 设置环境变量限制抓取数量
   export MCP_FETCH_LIMIT=2
   /flow-init "REQ-123|功能标题"
   ```

---

## 总结

### 核心差异

| 维度 | /flow-init | /flow-new |
|------|-----------|----------|
| **定位** | 阶段化初始化 | 端到端自动化 |
| **控制** | 精细控制 | 全自动执行 |
| **适用** | 复杂项目 | 简单需求 |
| **时间** | < 5分钟 | 30分钟-数小时 |
| **输出** | 需求目录+调研 | 完整开发产物 |

### 选择建议

```text
┌─────────────────────────────────────────────────┐
│          何时使用哪个命令？                      │
└─────────────────────────────────────────────────┘

🟢 使用 /flow-init:
   ✅ 复杂项目，需要逐步推进
   ✅ 需要中间审查和调整
   ✅ 学习和理解工作流
   ✅ 深度调研需求

🔵 使用 /flow-new:
   ✅ 简单明确的需求
   ✅ 快速原型开发
   ✅ 演示和学习 CC-DevFlow
   ✅ 标准化开发流程

⚠️  混合使用:
   ✅ 中等复杂度项目
   ✅ 需要部分阶段审查
   ✅ 团队协作开发
```

### 下一步

**学习资源**:
- [CC-DevFlow 入门指南](getting-started.md)
- [完整命令参考](../commands/)
- [技术架构指南](../.claude/CLAUDE.md)

**实践建议**:
1. 从简单需求开始，使用 `/flow-new` 体验完整流程
2. 尝试使用 `/flow-init` 逐步执行，理解每个阶段
3. 在实际项目中选择合适的命令
4. 遇到问题时查阅本指南的常见问题解答

---

**文档维护**:
- 有问题或建议？提交 [GitHub Issue](https://github.com/company/cc-devflow/issues)
- 贡献改进？查看 [CONTRIBUTING.md](../../CONTRIBUTING.md)

**版本历史**:
- v1.0.0 (2025-11-21): 初始版本
