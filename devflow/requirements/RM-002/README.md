# RM-002: 小程序首页服务列表

**Status**: 🔄 In Progress - Initialization Complete
**Priority**: P1 (High)
**Milestone**: M1-Q4-2025 (三端基础 + 小程序上线)
**Estimated Effort**: 1 week (~10 hours)

---

## Overview

实现微信小程序首页UI，展示陪玩服务列表（名称、描述、单价），使用Mock数据。

**Roadmap Context**:
- **Depends On**: RM-001 (小程序项目初始化) - ✅ Completed
- **Blocks**: RM-005~008 (管理后台), RM-010 (后端API), RM-011 (联调)
- **Feature Cluster**: Feature Cluster 1: 小程序核心功能
- **Quarter**: Q4-2025
- **Timeline**: Week 4 of M1-Q4-2025

---

## Workflow Checklist

### Phase 0: Initialization ✅ COMPLETE
- [x] Requirement directory structure created
- [x] Internal codebase research completed
- [x] External research (MCP) completed
- [x] Research tasks generated and decisions made
- [x] Git branch created: `feature/RM-002-小程序首页服务列表`

### Phase 1: Planning 🔄 IN PROGRESS
- [ ] PRD.md generated
- [ ] UI_PROTOTYPE.html generated (if applicable)
- [ ] TECH_DESIGN.md generated
- [ ] EPIC.md generated
- [ ] TASKS.md generated

### Phase 2: Development ⏳ PENDING
- [ ] All tasks completed (TDD order)
- [ ] Code implementation
- [ ] Unit tests written and passing

### Phase 3: Quality Assurance ⏳ PENDING
- [ ] TEST_PLAN.md generated
- [ ] TEST_REPORT.md generated
- [ ] SECURITY_PLAN.md generated
- [ ] SECURITY_REPORT.md generated
- [ ] All tests passing, coverage ≥80%

### Phase 4: Release ⏳ PENDING
- [ ] RELEASE_PLAN.md generated
- [ ] Pull Request created
- [ ] Code review completed
- [ ] Merged to main branch

---

## Key Documents

### Research Materials
- ✅ **Codebase Analysis**: `research/internal/codebase-overview.md`
- ✅ **Research Summary**: `research/research-summary.md`
- ✅ **Research Decisions**: `research/research.md`
- ✅ **External Resources**:
  - `research/mcp/20251121/official/wechat-list-rendering.md`
  - `research/mcp/20251121/tutorials/skeleton-screen-implementation.md`

### Planning Documents (To Be Generated)
- ⏳ **PRD**: `PRD.md`
- ⏳ **Tech Design**: `TECH_DESIGN.md`
- ⏳ **Epic**: `EPIC.md`
- ⏳ **Tasks**: `TASKS.md`

### Execution Tracking
- ✅ **Execution Log**: `EXECUTION_LOG.md`
- ✅ **Status**: `orchestration_status.json`

---

## Key Decisions (from Research)

1. **UI Enhancement Scope** (R001)
   - ✅ Decision: Moderate enhancement - Polish existing design
   - Focus on: Card styling, visual hierarchy, subtle animations

2. **Service Detail Page** (R002)
   - ✅ Decision: Defer to separate requirement (RM-XXX)
   - RM-002 focuses on list display only

3. **Image Asset Strategy** (R003)
   - ✅ Decision: Use Picsum placeholder URLs
   - Format: `https://picsum.photos/seed/{id}/300/200`

4. **Testing Strategy** (R004)
   - ✅ Decision: Manual testing + Unit tests for data layer
   - Test files: `miniapp/utils/__tests__/mock.test.js`

5. **Pull-down Refresh** (R006)
   - ✅ Decision: Enable in `index.json`
   - Logic already implemented in `index.js`

---

## Technical Context

### Target Modules
```
miniapp/pages/index/
├── index.wxml    # Service list UI
├── index.wxss    # Card styling
├── index.js      # Data loading logic
└── index.json    # Page configuration

miniapp/utils/
└── mock.js       # Service mock data
```

### Existing Infrastructure (from RM-001)
- ✅ Mini-program framework initialized
- ✅ Basic index page structure
- ✅ Mock data system (config.js, request.js, mock.js)
- ✅ Skeleton loading implemented
- ✅ Global utility styles (app.wxss)

---

## Next Steps

1. **Run `/flow-prd "RM-002"`** to generate PRD
   - PRD will use research findings
   - Define precise acceptance criteria
   - Include UI wireframes/specifications

2. **Run `/flow-tech "RM-002"`** to generate technical design
   - Architecture: Existing RM-001 structure
   - Data model: Service entity
   - API contracts: Mock data format

3. **Run `/flow-epic "RM-002"`** to generate tasks breakdown
   - Estimate: ~10 hours total
   - TDD order enforced

4. **Run `/flow-dev "RM-002"`** to execute development
   - Implement tasks in TASKS.md
   - Write tests first (TDD)
   - Git commit per task

---

## Related Requirements

- **RM-001**: 小程序项目初始化 - ✅ Completed (prerequisite)
- **RM-003**: 小程序客服入口 - ⏳ Pending (parallel work possible)
- **RM-XXX**: 服务详情页 - ⏳ Future (detail page deferred from RM-002)

---

**Last Updated**: 2025-11-21 15:52:00
**Current Phase**: Planning (Phase 1)
**Next Command**: `/flow-prd "RM-002"`
