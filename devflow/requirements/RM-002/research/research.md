# Research Decisions - RM-002: 小程序首页服务列表

**Generated**: 2025-11-21 15:50:00
**Status**: Complete
**Total Decisions**: 6
**Resolved**: 6

---

## Research Summary

Based on codebase analysis and external research, RM-002 has a solid foundation from RM-001. The main focus is UI enhancement and functionality refinement for the service list page.

**Key Context**:
- RM-001 completed: Mini-program framework, basic index page, mock data system, skeleton loading
- Estimated effort: ~10h (1.25 days) with moderate UI enhancement
- Ready to proceed: ✅ YES

---

## Decisions

### R001 — UI Enhancement Scope

**Decision**: Moderate enhancement - Polish existing design without major redesign

**Rationale**: Roadmap states "实现首页UI，展示服务列表" which implies functional UI. Current RM-001 implementation has good foundation. Focus on polishing: improve card styling (shadows, borders, spacing), enhance visual hierarchy, add subtle animations. Avoid major redesign to stay within 1-week timeline.

**Alternatives considered**:
- Minimal - Keep current layout, only fix issues (images, pull-refresh): Too basic, doesn't align with "implement UI" goal
- Significant - Redesign service cards, add filters/sorting: Out of scope, would require 2+ weeks

---

### R002 — Service Detail Page Scope

**Decision**: Defer detail page to separate requirement (RM-XXX)

**Rationale**: Roadmap RM-002 description only mentions "展示服务列表", no detail page mentioned. onServiceTap() currently logs ID. Implementing detail page would add ~8h (50% more work). Keep RM-002 focused on list display. Recommend creating RM-004 or RM-011 for detail page later.

**Alternatives considered**:
- Include detail page in RM-002: Would exceed 1-week estimate, blur requirement scope

---

### R003 — Image Asset Strategy

**Decision**: Use external placeholder URLs (Picsum)

**Rationale**: Mock data references non-existent local images. Using Picsum (https://picsum.photos/seed/{id}/300/200) provides: instant implementation, no asset management, works for demonstration, easily replaceable. Format: https://picsum.photos/seed/srv_001/300/200

**Alternatives considered**:
- Local placeholders: Requires creating/managing image files, slower
- Remove images: Degrades UI quality, conflicts with "implement UI" goal

---

### R004 — Testing Strategy

**Decision**: Manual testing + Unit tests for data layer

**Rationale**: RM-002 is simple list display. Manual testing in WeChat DevTools + real device sufficient for UI. Add unit tests for mock.js (getServices, getServiceById, error cases) to ensure data quality. Defer component/E2E tests to later requirements with complex interactions.

**Alternatives considered**:
- Component tests: Too heavy for RM-002 scope, would add 4+ hours
- E2E tests: Overkill for static list display

---

### R005 — wx:key Usage Confirmation

**Decision**: Current implementation is correct, use wx:key="id"

**Rationale**: Official WeChat docs recommend wx:key for dynamic lists. Current code already uses wx:key="id" on service list. Service.id is unique and immutable (srv_001, srv_002, srv_003). This preserves component state and improves re-render performance. No changes needed.

**Alternatives considered**:
- Use wx:key="*this": Only works for primitive values, not applicable here
- Omit wx:key: Framework warns, degrades performance

---

### R006 — Pull-down Refresh

**Decision**: Enable pull-down refresh in index.json

**Rationale**: Logic already implemented in index.js (onPullDownRefresh method exists). Only需要在 index.json 添加 "enablePullDownRefresh": true. Improves UX by allowing users to manually refresh service list. Common pattern in WeChat Mini Programs.

**Alternatives considered**:
- Keep disabled: User cannot manually refresh, poor UX

---

## Source Library

### Internal Research
- ✅ `research/internal/codebase-overview.md` - Complete codebase analysis

### External Research
- ✅ `research/mcp/20251121/official/wechat-list-rendering.md` - WeChat official wx:for docs
- ✅ `research/mcp/20251121/tutorials/skeleton-screen-implementation.md` - Skeleton loading tutorial
- ✅ `research/mcp/20251121/examples/skeleton-manual-implementation.md` - Manual skeleton example

---

**Research Status**: ✅ COMPLETE
**Ready for PRD**: ✅ YES
**Next Phase**: PRD Generation (prd-writer agent)
