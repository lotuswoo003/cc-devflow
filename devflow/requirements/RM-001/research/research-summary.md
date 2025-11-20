# Research Summary: RM-001 - 小程序项目初始化

**Requirement**: RM-001 - 小程序项目初始化
**Generated**: 2025-11-18T15:45:00+08:00
**Status**: Research completed with WebSearch (Context7 MCP pending)

---

## Executive Summary

已完成微信小程序官方文档和最佳实践的调研。基于 WebSearch 获取的信息，我们了解了：
1. 微信小程序的标准目录结构和核心文件
2. 项目初始化的完整流程
3. 开发工具的安装和配置
4. 技术栈和 API 能力
5. 2025 年的开发规范和最佳实践

**关键发现**: 微信小程序使用原生框架，包含 app.js/app.json/app.wxss 三个核心文件，每个页面包含 .js/.json/.wxml/.wxss 四个文件。

---

## Research Materials

### Internal (内部代码库)
- ✅ `research/internal/codebase-overview.md` - 项目现状分析
  - 项目类型：新项目（三端系统）
  - 技术栈：微信小程序原生框架
  - 目标目录：miniapp/
  - 无现有代码库（从零开始）

### External (外部资料)
- ✅ `research/mcp/20251118/wechat-miniprogram-overview.md` - 微信小程序官方文档概览
  - 来源：WebSearch 结果汇总
  - 包含：目录结构、开发流程、技术栈、最佳实践
  - 官方文档链接：developers.weixin.qq.com

### Pending (待补充)
- ⏳ **Context7 MCP 详细文档** (连接失败，待重试)
  - 微信小程序 API 详细文档
  - 组件库完整说明
  - 最佳实践深度指南

---

## Key Insights

### 1. 项目结构标准化

**核心发现**: 微信小程序有严格的目录结构要求

```
miniapp/
├── pages/              # 页面目录（必须）
│   ├── index/         # 首页
│   └── customer/      # 客服页
├── components/         # 组件目录（推荐）
├── utils/              # 工具函数（推荐）
├── app.js              # 应用入口（必须）
├── app.json            # 全局配置（必须）
├── app.wxss            # 全局样式（可选）
└── project.config.json # 项目配置（必须）
```

**应用到 RM-001**:
- 创建标准目录结构
- 配置 app.json 中的页面路由
- 设置全局样式（app.wxss）
- 配置项目（project.config.json）

### 2. 四文件页面模式

**核心发现**: 每个页面由 4 个文件组成

- `.js` - 页面逻辑和数据
- `.json` - 页面配置
- `.wxml` - 页面结构（类似 HTML）
- `.wxss` - 页面样式（类似 CSS）

**应用到 RM-001**:
- 为 index 和 customer 页面创建完整的 4 文件结构
- 在 app.json 中注册页面路由

### 3. 开发工具链

**核心发现**: 必须使用微信开发者工具

- 下载地址：WeChat 官方网站
- 需要 AppID（从 mp.weixin.qq.com 获取）
- 支持模拟器和真机调试
- 提供 QuickStart 模板

**应用到 RM-001**:
- 推荐使用 QuickStart 模板生成初始结构
- 或手动创建标准目录结构
- 配置 project.config.json

### 4. Mock 数据策略

**核心发现**: 前端先行需要 Mock 数据

**应用到 RM-001**:
- 在 utils/ 中创建 mock.js
- 定义服务列表的 Mock 数据结构
- 封装 request.js 支持 Mock 和真实 API 切换

### 5. 技术限制

**核心发现**: 包大小和性能限制

- 主包 ≤ 2MB
- 总包 ≤ 20MB
- 优化图片和代码

**应用到 RM-001**:
- 设计轻量级的基础框架
- 避免引入大型第三方库
- 为未来扩展预留分包策略

---

## Decisions & Recommendations

### Decision 1: 使用微信小程序原生框架

**理由**:
- 项目仅需微信小程序端（无跨平台需求）
- 原生框架性能最优
- 符合 Architecture ADR-004 决策
- 符合宪法 Article VIII (Anti-Abstraction)

**替代方案**:
- ❌ Uni-App: 跨平台能力本项目不需要
- ❌ Taro: 增加学习成本和抽象层

**状态**: ✅ Confirmed

### Decision 2: 手动创建标准目录结构

**理由**:
- 完全控制项目结构
- 避免 QuickStart 模板的不必要文件
- 符合 ARCHITECTURE.md 的目录规范
- 教育价值（理解每个文件的作用）

**替代方案**:
- ❌ 使用 QuickStart 模板: 包含示例代码需要清理

**状态**: ✅ Confirmed

### Decision 3: 创建 utils/request.js 和 utils/mock.js

**理由**:
- 前端先行策略需要 Mock 数据
- 统一网络请求封装
- 方便未来切换到真实 API (RM-011)

**状态**: ✅ Confirmed

### Decision 4: 配置两个页面（index, customer）

**理由**:
- index: RM-002 需要（服务列表）
- customer: RM-003 需要（客服入口）
- 在 RM-001 中预先配置路由

**状态**: ✅ Confirmed

---

## Implementation Checklist

基于研究结果，RM-001 需要实现：

### 核心文件
- [ ] `miniapp/app.js` - 应用入口和生命周期
- [ ] `miniapp/app.json` - 全局配置（页面路由）
- [ ] `miniapp/app.wxss` - 全局样式（设计系统）
- [ ] `miniapp/project.config.json` - 项目配置

### 页面文件
- [ ] `miniapp/pages/index/index.js`
- [ ] `miniapp/pages/index/index.json`
- [ ] `miniapp/pages/index/index.wxml`
- [ ] `miniapp/pages/index/index.wxss`
- [ ] `miniapp/pages/customer/customer.js`
- [ ] `miniapp/pages/customer/customer.json`
- [ ] `miniapp/pages/customer/customer.wxml`
- [ ] `miniapp/pages/customer/customer.wxss`

### 工具函数
- [ ] `miniapp/utils/request.js` - 网络请求封装
- [ ] `miniapp/utils/mock.js` - Mock 数据

### 目录
- [ ] `miniapp/components/` - 组件目录（空）

---

## How to Use This Research

### For PRD Generation (/flow-prd)
- 参考 "Project Structure" 定义需求范围
- 参考 "Implementation Checklist" 定义验收标准
- 参考 "Technical Limitations" 定义非功能性需求

### For Technical Design (/flow-tech)
- 参考 "Four-File Page Pattern" 设计页面结构
- 参考 "Mock Data Strategy" 设计数据层
- 参考 "Development Toolchain" 定义开发环境

### For Epic & Tasks (/flow-epic)
- 使用 "Implementation Checklist" 作为任务分解基础
- 每个核心文件一个任务
- 每个页面一个任务组

---

## Pending Research Items

### 1. Context7 MCP - WeChat Mini-Program API 详细文档
**Status**: ⏳ Pending (连接失败)
**Priority**: Medium
**Reason**: WebSearch 已提供足够的基础信息
**Plan**: 在 /flow-tech 阶段如需详细 API 文档时重试

### 2. Mock.js 使用指南
**Status**: ⏳ Pending
**Priority**: Low
**Reason**: RM-001 只需创建框架，Mock 数据在 RM-002 实现
**Plan**: 在 RM-002 时搜集

### 3. 微信小程序性能优化最佳实践
**Status**: ⏳ Pending
**Priority**: Low
**Reason**: 初始化阶段不涉及性能优化
**Plan**: 在后续优化需求时搜集

---

## External Links (for Reference)

### Official Documentation
- [Framework Documentation](https://developers.weixin.qq.com/miniprogram/en/dev/framework/)
- [Getting Started](https://developers.weixin.qq.com/miniprogram/en/dev/framework/quickstart/getstart.html)
- [Directory Structure](https://developers.weixin.qq.com/miniprogram/dev/framework/structure.html)

### Community Resources
- [2025 Development Guide](https://tryon.kivisense.com/blog/wechat-mini-program-development/)
- [Complete Manual](https://medium.com/@yelin.qiu/a-complete-manual-on-wechat-mini-program-development-8fd28a85ee0d)

---

## Conclusion

✅ **Research Status**: Sufficient for RM-001 initialization

虽然 Context7 MCP 连接失败，但通过 WebSearch 我们已经获取了足够的官方文档和最佳实践信息，足以支持 RM-001 的 PRD、技术设计和任务分解。

**Next Steps**:
1. ✅ 继续 /flow-init 流程（生成 research/tasks.json）
2. → 进入 /flow-prd 阶段
3. → 在需要详细 API 文档时重试 Context7 MCP

---

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-18T15:45:00+08:00
