# Product Backlog: 陪玩服务平台

**Updated**: 2025-11-18T14:30:00+08:00 北京时间
**Total Items**: 11
**P1 Count**: 9 | **P2 Count**: 2 | **P3 Count**: 0

---

## Priority 1 (MVP Must-Have)

*P1 是必须完成的核心功能，没有这些功能产品无法交付价值。*

### RM-001: 小程序项目初始化

- **Description**: 创建小程序项目，配置基础框架、页面路由、公共样式
- **Business Value**: 作为小程序开发的基础，必须首先完成。提供统一的项目结构和配置，确保后续页面开发的一致性和效率。

- **Effort**: S (Small)
  - 预计: 0.5 周

- **Dependencies**: 无

- **Derived From**: 新项目

- **Target Milestone**: M1-Q4-2025

- **Status**: Backlog

---

### RM-002: 小程序首页服务列表

- **Description**: 实现首页UI，展示服务列表（名称、描述、单价），使用Mock数据
- **Business Value**: 小程序的核心功能，用户打开小程序首先看到的页面。展示陪玩服务是产品的主要价值，必须优先实现。

- **Effort**: M (Medium)
  - 预计: 1 周

- **Dependencies**: RM-001（小程序项目初始化）

- **Derived From**: 新项目

- **Target Milestone**: M1-Q4-2025

- **Status**: Backlog

---

### RM-003: 小程序客服入口

- **Description**: 实现客服按钮，点击可拨打电话或跳转微信客服
- **Business Value**: 客服咨询是用户了解详细服务的关键途径，也是转化用户的重要环节。必须在MVP阶段提供。

- **Effort**: S (Small)
  - 预计: 0.5 周

- **Dependencies**: RM-001（小程序项目初始化）

- **Derived From**: 新项目

- **Target Milestone**: M1-Q4-2025

- **Status**: Backlog

---

### RM-004: Vue管理后台框架

- **Description**: 搭建Vue项目，配置路由、布局、权限框架
- **Business Value**: 管理后台的基础架构，运营人员需要通过后台管理服务内容。框架搭建是后续所有管理功能的前提。

- **Effort**: M (Medium)
  - 预计: 1 周

- **Dependencies**: 无

- **Derived From**: 新项目

- **Target Milestone**: M1-Q4-2025

- **Status**: Backlog

---

### RM-005: 服务项目管理页面

- **Description**: 实现服务项目的列表、新增、编辑、删除页面，使用Mock数据
- **Business Value**: 核心的运营功能，运营人员需要灵活配置陪玩服务（名称、描述、单价）。这是管理后台最重要的功能。

- **Effort**: M (Medium)
  - 预计: 1 周

- **Dependencies**: RM-004（Vue管理后台框架）

- **Derived From**: 新项目

- **Target Milestone**: M2-Q1-2026

- **Status**: Backlog

---

### RM-006: 客服配置页面

- **Description**: 实现客服信息配置页面（电话、微信号等）
- **Business Value**: 运营人员需要能够动态配置客服联系方式，避免硬编码，提升灵活性。

- **Effort**: S (Small)
  - 预计: 0.5 周

- **Dependencies**: RM-004（Vue管理后台框架）

- **Derived From**: 新项目

- **Target Milestone**: M2-Q1-2026

- **Status**: Backlog

---

### RM-009: SpringBoot后端基础架构

- **Description**: 搭建项目骨架，数据库设计，统一响应格式，接口文档
- **Business Value**: 后端服务的基础，提供API支持前端数据交互。数据库设计是系统数据持久化的关键，必须优先完成。

- **Effort**: M (Medium)
  - 预计: 1 周

- **Dependencies**: 无

- **Derived From**: 新项目

- **Target Milestone**: M1-Q4-2025

- **Status**: Backlog

---

### RM-010: 后端API开发

- **Description**: 实现所有业务接口（服务管理、用户、客服、咨询记录）
- **Business Value**: 提供完整的后端API，支持前端（小程序和管理后台）的所有业务功能。是前后端集成的关键。

- **Effort**: M (Medium)
  - 预计: 2 周

- **Dependencies**: RM-009（SpringBoot后端基础架构）

- **Derived From**: 新项目

- **Target Milestone**: M2-Q1-2026

- **Status**: Backlog

---

### RM-011: 前后端联调

- **Description**: 小程序和管理后台对接真实API，替换Mock数据
- **Business Value**: 实现端到端的业务流程，确保系统可完整运行。这是MVP交付的最后一步，必须完成才能上线。

- **Effort**: M (Medium)
  - 预计: 1 周

- **Dependencies**: RM-002, RM-003, RM-005, RM-010

- **Derived From**: 新项目

- **Target Milestone**: M2-Q1-2026

- **Status**: Backlog

---

## Priority 2 (Important)

*P2 是重要但非MVP必需的功能，可在MVP之后逐步补充。*

### RM-007: 用户列表页面

- **Description**: 实现用户列表查看页面
- **Business Value**: 帮助运营人员了解用户情况，虽然重要但不影响核心业务流程，可在MVP之后补充。

- **Effort**: S (Small)
  - 预计: 0.5 周

- **Dependencies**: RM-004（Vue管理后台框架）

- **Derived From**: 新项目

- **Target Milestone**: M2-Q1-2026

- **Status**: Backlog

---

### RM-008: 咨询记录页面

- **Description**: 实现用户咨询记录列表页面
- **Business Value**: 帮助运营人员查看历史咨询，优化服务质量。虽然有价值但不影响MVP交付，可后续补充。

- **Effort**: S (Small)
  - 预计: 0.5 周

- **Dependencies**: RM-004（Vue管理后台框架）

- **Derived From**: 新项目

- **Target Milestone**: M2-Q1-2026

- **Status**: Backlog

---

## Priority 3 (Nice-to-Have)

*P3 是锦上添花的功能，资源允许时再考虑实现。*

*当前无 P3 项目*

---

## Dependency Matrix

| RM-ID | Blocks (被依赖) | Blocked By (依赖) |
|-------|-----------------|-------------------|
| RM-001 | RM-002, RM-003 | - |
| RM-002 | RM-011 | RM-001 |
| RM-003 | RM-011 | RM-001 |
| RM-004 | RM-005, RM-006, RM-007, RM-008 | - |
| RM-005 | RM-011 | RM-004 |
| RM-006 | - | RM-004 |
| RM-007 | - | RM-004 |
| RM-008 | - | RM-004 |
| RM-009 | RM-010 | - |
| RM-010 | RM-011 | RM-009 |
| RM-011 | - | RM-002, RM-003, RM-005, RM-010 |

*说明:
- "Blocks" 列表示哪些项目依赖此项目
- "Blocked By" 列表示此项目依赖哪些项目
- "-" 表示无依赖关系*

---

## Usage Notes

**如何使用 Backlog**:

1. **启动新需求**: 从 Backlog 中选择一个 RM-ID，运行 `/flow-init {RM-ID}` 创建正式需求
2. **优先级调整**: 根据业务变化，可随时调整优先级
3. **状态更新**: 当 RM 转为 REQ 后，更新 Status 为 "In Progress"
4. **进度同步**: 定期运行 `sync-roadmap-progress.sh` 同步 ROADMAP.md 和 BACKLOG.md 的进度

**建议实施顺序**:

**阶段1 - Q4-2025（基础框架）**:
1. RM-001 → RM-002 → RM-003 (小程序完整功能)
2. RM-004 (管理后台框架)
3. RM-009 (后端基础架构)

**阶段2 - Q1-2026（功能完善）**:
4. RM-005 → RM-006 (管理后台核心功能)
5. RM-010 (后端API)
6. RM-007 → RM-008 (管理后台扩展功能)
7. RM-011 (前后端联调)

---

**Last Updated**: 2025-11-18T14:30:00+08:00
